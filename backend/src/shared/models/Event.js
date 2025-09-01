/**
 * Event model class (Backend version)
 *
 * Keep this synchronized with frontend/src/shared/models/Event.js
 * Or better yet, consider symlinking them if they're identical
 */
class Event {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.description = data.description || null;
    this.location = data.location || null;
    this.registrationCount =
      data.registrationCount || data.registration_count || null;
    this.startDate = data.startDate || data.start_date || null;
    this.endDate = data.endDate || data.end_date || null;
    this.banner = data.banner || null;
    this.landingConfig = data.landingConfig || data.landing_config || null;
    this.slug = data.slug || null;
    this.clubId = data.clubId || data.club_id || null;
    this.createdBy = data.createdBy || data.created_by || null;
  }

  /**
   * Check if event is currently active
   */
  isActive() {
    if (!this.startDate || !this.endDate) return false;

    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    return now >= start && now <= end;
  }

  /**
   * Check if event is upcoming
   */
  isUpcoming() {
    if (!this.startDate) return false;
    return new Date() < new Date(this.startDate);
  }

  /**
   * Check if event is past
   */
  isPast() {
    if (!this.endDate) return false;
    return new Date() > new Date(this.endDate);
  }

  /**
   * Generate URL-friendly slug
   */
  generateSlug() {
    if (!this.name) return "";

    return this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /**
   * Validate event data
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (this.name && this.name.length > 100) {
      errors.push("Name must be 100 characters or less");
    }

    if (!this.startDate) {
      errors.push("Start date is required");
    }

    if (!this.endDate) {
      errors.push("End date is required");
    }

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      if (start > end) {
        errors.push("Start date must be before end date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Return clean object for API responses
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      location: this.location,
      registrationCount: this.registrationCount,
      startDate: this.startDate,
      endDate: this.endDate,
      banner: this.banner,
      landingConfig: this.landingConfig,
      slug: this.slug,
      clubId: this.clubId,
      createdBy: this.createdBy,
    };
  }
}

module.exports = { Event };
