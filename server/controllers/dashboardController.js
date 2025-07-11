import db from '../models/index.js';
import { Op } from 'sequelize';

// Get admin dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    // Verify user is admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Get current date and time
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total stats
    const totalCustomers = await db.Customer.count();
    const totalCars = await db.Car.count();
    const totalRentals = await db.Rental.count();

    // Get active rentals
    const activeRentals = await db.Rental.count({
      where: {
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now }
      }
    });

    // Get new registrations this month
    const newCustomersThisMonth = await db.Customer.count({
      where: {
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    // Get revenue statistics
    const revenueThisMonth = await db.Rental.sum('totalCost', {
      where: {
        createdAt: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    const revenuePreviousMonth = await db.Rental.sum('totalCost', {
      where: {
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfMonth
        }
      }
    }) || 0;

    // Get recent rentals
    const recentRentals = await db.Rental.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: db.Car, as: 'car', attributes: ['id', 'make', 'model', 'year', 'licensePlate'] }
      ]
    });

    // Get customer distribution by role
    const customersByRole = await db.Customer.findAll({
      attributes: [
        'role',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    // Get car availability statistics
    const availableCars = await db.Car.count({
      where: { isAvailable: true }
    });

    const stats = {
      totalCustomers,
      totalCars,
      totalRentals,
      activeRentals,
      availableCars,
      unavailableCars: totalCars - availableCars,
      newCustomersThisMonth,
      revenueThisMonth,
      revenuePreviousMonth,
      revenueGrowth: revenuePreviousMonth > 0
        ? ((revenueThisMonth - revenuePreviousMonth) / revenuePreviousMonth) * 100
        : 100,
      customersByRole,
      recentRentals
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get owner dashboard stats - more limited than admin stats
export const getOwnerStats = async (req, res) => {
  try {
    // Verify user is owner or admin
    if (req.userRole !== 'owner' && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Owner privileges required.' });
    }

    // Get current date and time
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total stats (owner can see less information)
    const totalCars = await db.Car.count();
    const totalRentals = await db.Rental.count();
    const activeRentals = await db.Rental.count({
      where: {
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now }
      }
    });

    // Get revenue statistics
    const revenueThisMonth = await db.Rental.sum('totalCost', {
      where: {
        createdAt: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    const revenuePreviousMonth = await db.Rental.sum('totalCost', {
      where: {
        createdAt: {
          [Op.gte]: startOfPrevMonth,
          [Op.lt]: startOfMonth
        }
      }
    }) || 0;

    // Get recent rentals
    const recentRentals = await db.Rental.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: db.Car, as: 'car', attributes: ['id', 'make', 'model', 'year', 'licensePlate'] }
      ]
    });

    // Get car availability statistics
    const availableCars = await db.Car.count({
      where: { isAvailable: true }
    });

    const stats = {
      totalCars,
      totalRentals,
      activeRentals,
      availableCars,
      unavailableCars: totalCars - availableCars,
      revenueThisMonth,
      revenuePreviousMonth,
      revenueGrowth: revenuePreviousMonth > 0
        ? ((revenueThisMonth - revenuePreviousMonth) / revenuePreviousMonth) * 100
        : 100,
      recentRentals
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get revenue data for charts
export const getRevenueData = async (req, res) => {
  try {
    // Verify user has appropriate role
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Admin or owner privileges required.' });
    }

    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;
    let groupByFormat;
    let responseFormat;

    // Set the date range based on the requested period
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        groupByFormat = '%Y-%m-%d'; // Group by day
        responseFormat = 'YYYY-MM-DD';
        break;
      
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        groupByFormat = '%Y-%m'; // Group by month
        responseFormat = 'YYYY-MM';
        break;
      
      case 'month':
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        groupByFormat = '%Y-%m-%d'; // Group by day
        responseFormat = 'YYYY-MM-DD';
        break;
    }

    // Get revenue data grouped by date
    const revenueData = await db.sequelize.query(`
      SELECT 
        DATE_FORMAT(createdAt, '${groupByFormat}') as date,
        SUM(totalCost) as revenue,
        COUNT(*) as count
      FROM rentals
      WHERE createdAt >= :startDate
      GROUP BY date
      ORDER BY date ASC
    `, {
      replacements: { startDate },
      type: db.sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      period,
      format: responseFormat,
      data: revenueData
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get car utilization data
export const getCarUtilizationData = async (req, res) => {
  try {
    // Verify user has appropriate role
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Admin or owner privileges required.' });
    }

    // Get top rented cars
    const topRentedCars = await db.Car.findAll({
      attributes: [
        'id',
        'make',
        'model',
        'year',
        [db.sequelize.fn('COUNT', db.sequelize.col('rentals.id')), 'rentalCount']
      ],
      include: [{
        model: db.Rental,
        as: 'rentals',
        attributes: []
      }],
      group: ['Car.id'],
      order: [[db.sequelize.literal('rentalCount'), 'DESC']],
      limit: 10
    });

    // Get utilization by car category/type
    const utilizationByType = await db.sequelize.query(`
      SELECT 
        c.type,
        COUNT(r.id) as rentalCount,
        COUNT(r.id) * 100.0 / (SELECT COUNT(*) FROM rentals) as percentage
      FROM cars c
      LEFT JOIN rentals r ON c.id = r.carId
      GROUP BY c.type
      ORDER BY rentalCount DESC
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    return res.status(200).json({
      topRentedCars,
      utilizationByType
    });
  } catch (error) {
    console.error('Error fetching car utilization data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Generate CSV reports
export const generateReport = async (req, res) => {
  try {
    // Verify user has admin role
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const { reportType, startDate, endDate } = req.query;
    
    if (!reportType) {
      return res.status(400).json({ message: 'Report type is required' });
    }

    let data;
    let filename;
    let csvData = [];
    const dateFilter = {};

    // Apply date filters if provided
    if (startDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, [Op.gte]: new Date(startDate) };
    }
    
    if (endDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, [Op.lte]: new Date(endDate) };
    }

    // Generate report based on type
    switch (reportType) {
      case 'customers':
        data = await db.Customer.findAll({
          where: dateFilter,
          attributes: { exclude: ['password'] },
          order: [['createdAt', 'DESC']]
        });
        
        // Convert to CSV format
        csvData = data.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          role: customer.role,
          isActive: customer.isActive ? 'Yes' : 'No',
          createdAt: customer.createdAt.toISOString().split('T')[0],
          lastLogin: customer.lastLogin ? customer.lastLogin.toISOString().split('T')[0] : 'Never'
        }));
        
        filename = `customers_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'rentals':
        data = await db.Rental.findAll({
          where: dateFilter,
          include: [
            { model: db.Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
            { model: db.Car, as: 'car', attributes: ['id', 'make', 'model', 'year', 'licensePlate'] }
          ],
          order: [['createdAt', 'DESC']]
        });

        // Convert to CSV format
        csvData = data.map(rental => ({
          id: rental.id,
          customerName: rental.customer?.name || 'Unknown',
          customerEmail: rental.customer?.email || 'Unknown',
          car: `${rental.car?.make} ${rental.car?.model} (${rental.car?.year})`,
          licensePlate: rental.car?.licensePlate || 'Unknown',
          startDate: rental.startDate.toISOString().split('T')[0],
          endDate: rental.endDate.toISOString().split('T')[0],
          totalCost: `$${rental.totalCost.toFixed(2)}`,
          status: new Date() > rental.endDate ? 'Completed' : 
                 new Date() < rental.startDate ? 'Upcoming' : 'Active',
          createdAt: rental.createdAt.toISOString().split('T')[0]
        }));
        
        filename = `rentals_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'revenue':
        // Get revenue grouped by day for the period
        data = await db.sequelize.query(`
          SELECT 
            DATE(createdAt) as date,
            SUM(totalCost) as revenue,
            COUNT(*) as rentalCount
          FROM rentals
          WHERE createdAt BETWEEN :startDate AND :endDate
          GROUP BY DATE(createdAt)
          ORDER BY date ASC
        `, {
          replacements: { 
            startDate: startDate || new Date(new Date().setMonth(new Date().getMonth() - 1)), 
            endDate: endDate || new Date() 
          },
          type: db.sequelize.QueryTypes.SELECT
        });

        // Convert to CSV format
        csvData = data.map(row => ({
          date: row.date,
          revenue: `$${parseFloat(row.revenue).toFixed(2)}`,
          rentalCount: row.rentalCount
        }));
        
        filename = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Prepare CSV data (simplified, in a real app you would use a CSV library)
    if (csvData.length === 0) {
      return res.status(404).json({ message: 'No data available for the report' });
    }

    // Return the data rather than creating a file
    // In a real app, you might generate a file and provide a download URL
    return res.status(200).json({
      reportType,
      filename,
      data: csvData,
      count: csvData.length
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Platform settings
export const getPlatformSettings = async (req, res) => {
  // In a real app, you would store settings in a database
  // This is a placeholder implementation
  try {
    // Verify user has admin role
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Mock settings data
    const settings = {
      general: {
        siteName: 'Car Rental Service',
        contactEmail: 'support@carrentalservice.com',
        allowRegistration: true,
        maintenanceMode: false
      },
      rental: {
        minRentalDuration: 1, // days
        maxRentalDuration: 30, // days
        defaultDailyRate: 50, // $
        lateReturnFee: 25, // $
        depositAmount: 200 // $
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        reminderDays: 1 // days before rental
      },
      security: {
        passwordPolicy: {
          minLength: 8,
          requireSpecialChar: true,
          requireNumber: true
        },
        sessionTimeout: 60, // minutes
        failedLoginAttempts: 5
      }
    };

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update platform settings
export const updatePlatformSettings = async (req, res) => {
  try {
    // Verify user has admin role
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // In a real app, you would validate and save settings to the database
    // This is a placeholder implementation
    const settings = req.body;

    // Validate settings (basic validation)
    if (!settings) {
      return res.status(400).json({ message: 'Settings object is required' });
    }

    // Pretend we saved the settings
    return res.status(200).json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating platform settings:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};