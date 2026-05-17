const { count, findOne, list } = require("../utils/supabaseData");

async function getDashboardData(req, res) {
  try {
    const [
      bookingsCount,
      pendingBookingsCount,
      inquiriesCount,
      unreadInquiriesCount,
      servicesCount,
      resultsCount,
      testimonialsCount,
      newsletterCount,
      availabilityCount,
      recentBookings,
      recentInquiries,
      settings
    ] = await Promise.all([
      count("bookings"),
      count("bookings", { status: "pending" }),
      count("inquiries"),
      count("inquiries", { status: "unread" }),
      count("services"),
      count("results"),
      count("testimonials"),
      count("newsletter"),
      count("availability"),
      list("bookings", { order: [{ column: "created_at", ascending: false }], limit: 5 }),
      list("inquiries", { order: [{ column: "created_at", ascending: false }], limit: 5 }),
      findOne("settings", {}, [{ column: "created_at", ascending: false }])
    ]);

    return res.status(200).json({
      success: true,
      data: {
        counts: {
          bookings: bookingsCount,
          pendingBookings: pendingBookingsCount,
          inquiries: inquiriesCount,
          unreadInquiries: unreadInquiriesCount,
          services: servicesCount,
          results: resultsCount,
          testimonials: testimonialsCount,
          newsletterLeads: newsletterCount,
          availabilitySlots: availabilityCount
        },
        recentBookings,
        recentInquiries,
        settings
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin dashboard data."
    });
  }
}

module.exports = {
  getDashboardData
};

