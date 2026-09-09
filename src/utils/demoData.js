// Realistic student expenses for demonstration
export const INITIAL_CATEGORY_BUDGETS = {
  Food: 3500,
  Transport: 1500,
  Education: 2500,
  Shopping: 2000,
  Entertainment: 1200,
  Recharge: 500,
  Other: 800
};

export const DEFAULT_MONTHLY_BUDGET = 12000;

export const getDemoExpenses = () => {
  const now = new Date();
  
  // Format dates relative to today
  const formatDate = (daysAgo) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'demo-1',
      amount: 140,
      description: 'College Canteen Lunch & Tea',
      category: 'Food',
      date: formatDate(0),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 'demo-2',
      amount: 45,
      description: 'Metro Transit to Campus',
      category: 'Transport',
      date: formatDate(0),
      paymentMethod: 'Card',
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString()
    },
    {
      id: 'demo-3',
      amount: 499,
      description: 'Monthly Mobile Data Recharge',
      category: 'Recharge',
      date: formatDate(1),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString()
    },
    {
      id: 'demo-4',
      amount: 650,
      description: 'Data Structures Textbook & Notebooks',
      category: 'Education',
      date: formatDate(2),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString()
    },
    {
      id: 'demo-5',
      amount: 320,
      description: 'Weekend Movie Ticket with Friends',
      category: 'Entertainment',
      date: formatDate(3),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 75).toISOString()
    },
    {
      id: 'demo-6',
      amount: 890,
      description: 'Casual Hoodie from Campus Fest Sale',
      category: 'Shopping',
      date: formatDate(4),
      paymentMethod: 'Card',
      createdAt: new Date(now - 1000 * 60 * 60 * 98).toISOString()
    },
    {
      id: 'demo-7',
      amount: 120,
      description: 'Late Night Coffee & Sandwich',
      category: 'Food',
      date: formatDate(5),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 122).toISOString()
    },
    {
      id: 'demo-8',
      amount: 60,
      description: 'Auto Rickshaw to Exam Center',
      category: 'Transport',
      date: formatDate(6),
      paymentMethod: 'Cash',
      createdAt: new Date(now - 1000 * 60 * 60 * 145).toISOString()
    },
    {
      id: 'demo-9',
      amount: 1200,
      description: 'Semester Lab Manuals & Printing',
      category: 'Education',
      date: formatDate(8),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 190).toISOString()
    },
    {
      id: 'demo-10',
      amount: 350,
      description: 'Hostel Room Cleaning Supplies',
      category: 'Other',
      date: formatDate(10),
      paymentMethod: 'Cash',
      createdAt: new Date(now - 1000 * 60 * 60 * 240).toISOString()
    },
    {
      id: 'demo-11',
      amount: 280,
      description: 'Pizza Slice & Soda',
      category: 'Food',
      date: formatDate(12),
      paymentMethod: 'UPI',
      createdAt: new Date(now - 1000 * 60 * 60 * 288).toISOString()
    },
    {
      id: 'demo-12',
      amount: 150,
      description: 'Bus Monthly Pass Renewal',
      category: 'Transport',
      date: formatDate(15),
      paymentMethod: 'Card',
      createdAt: new Date(now - 1000 * 60 * 60 * 360).toISOString()
    }
  ];
};
