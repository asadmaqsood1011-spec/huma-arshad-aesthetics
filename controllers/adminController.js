const BookingRequest = require("../models/BookingRequest");
const ContactInquiry = require("../models/ContactInquiry");
const Service = require("../models/Service");
const ResultCase = require("../models/ResultCase");
const Testimonial = require("../models/Testimonial");
const NewsletterLead = require("../models/NewsletterLead");
const AvailabilitySlot = require("../models/AvailabilitySlot");
const SiteSetting = require("../models/SiteSetting");

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
      BookingRequest.countDocuments(),
      BookingRequest.countDocuments({ status: "pending" }),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: "unread" }),
      Service.countDocuments(),
      ResultCase.countDocuments(),
      Testimonial.countDocuments(),
      NewsletterLead.countDocuments(),
      AvailabilitySlot.countDocuments(),
      BookingRequest.find().sort({ createdAt: -1 }).limit(5),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5),
      SiteSetting.findOne().sort({ createdAt: -1 })
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
