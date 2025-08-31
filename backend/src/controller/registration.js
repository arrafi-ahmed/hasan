const router = require("express").Router();
const registrationService = require("../service/registration");
const emailService = require("../service/email");
const eventService = require("../service/event");
const stripeService = require("../service/stripe");
const attendeeService = require("../service/attendees");
const ApiResponse = require("../model/ApiResponse");
const {
    auth,
    isAdminEventAuthor,
    isAuthenticated,
} = require("../middleware/auth");
const {uploadTmp} = require("../middleware/upload");

router.post("/initRegistration", async (req, res, next) => {
    try {
        const result = await registrationService.initRegistration(req.body);
        res.status(200).json(new ApiResponse(null, result));
    } catch (err) {
        next(err);
    }
});

router.post(
    "/bulkImportAttendee",
    auth,
    uploadTmp,
    async (req, res, next) => {
        try {
            const result = await registrationService.bulkImportAttendee({
                files: req.files,
                eventId: req.body.eventId,
                clubId: req.currentUser.clubId,
            });
            res.json(
                new ApiResponse(
                    `${result.insertCount} Attendees imported successfully!`,
                    result,
                ),
            );
        } catch (err) {
            next(err);
        }
    },
);

router.post("/save", async (req, res, next) => {
    try {
        const results = await registrationService.save({payload: req.body});
        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});

// Complete free registration (no payment required)
router.post("/complete-free-registration", async (req, res, next) => {
    try {
        const result = await registrationService.completeFreeRegistration({
            payload: req.body
        });

        res.status(200).json(new ApiResponse("Registration completed successfully", result));
    } catch (err) {
        next(err);
    }
});

router.post("/updateStatus", async (req, res, next) => {
    try {
        const results = await registrationService.updateStatus({payload: req.body});
        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});

router.get("/getRegistration", async (req, res, next) => {
    try {
        const results = await registrationService.getRegistration({
            registrationId: req.query.registrationId,
            qrUuid: req.query.qrUuid,
            isLoggedIn: false, // Success page is public
        });
        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});

router.get("/getRegistrationsByEventId", async (req, res, next) => {
    try {
        const results = await registrationService.getAttendees({
            eventId: req.query.eventId,
        });
        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});

router.get("/getRegistrationById", async (req, res, next) => {
    try {
        const results = await registrationService.getRegistrationById({
            registrationId: req.query.registrationId,
        });
        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});

router.get("/getRegistrationByQrUuid", async (req, res, next) => {
    try {
        // Since there's no getRegistrationByQrUuid method, we'll need to implement it
        // For now, let's return null or implement the method
        res.status(200).json(new ApiResponse(null, null));
    } catch (err) {
        next(err);
    }
});

router.get("/getRegistrationByEmail", async (req, res, next) => {
    try {
        const results = await registrationService.getRegistrationByEmail({
            email: req.query.email,
            eventId: req.query.eventId,
        });
        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});

router.get("/getAttendees", auth, isAdminEventAuthor, async (req, res, next) => {
    try {
        let results;

        if (req.query.searchKeyword && req.query.searchKeyword.trim()) {
            // Use search function when keyword is provided
            results = await registrationService.searchAttendees({
                eventId: req.query.eventId,
                searchKeyword: req.query.searchKeyword,
                sortBy: req.query.sortBy,
            });
        } else {
            // Use get function when no search keyword
            results = await registrationService.getAttendees({
                eventId: req.query.eventId,
                sortBy: req.query.sortBy,
            });
        }

        res.status(200).json(new ApiResponse(null, results));
    } catch (err) {
        next(err);
    }
});


router.get("/removeRegistration", auth, isAdminEventAuthor, async (req, res, next) => {
    try {
        const results = await registrationService.removeRegistration({
            registrationId: req.query.registrationId,
            eventId: req.query.eventId,
        });
        res.status(200).json(new ApiResponse("Registration deleted!", results));
    } catch (err) {
        next(err);
    }
});

router.get("/deleteAttendee", auth, isAdminEventAuthor, async (req, res, next) => {
    try {
        const results = await attendeeService.deleteAttendee({
            attendeeId: req.query.attendeeId,
            eventId: req.query.eventId,
        });
        res.status(200).json(new ApiResponse("Attendee deleted!", results));
    } catch (err) {
        next(err);
    }
});

router.get("/downloadAttendees", auth, isAdminEventAuthor, async (req, res, next) => {
    try {
        const workbook = await registrationService.downloadAttendees({eventId: req.query.eventId});
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "attendee-report.xlsx",
        );
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        next(err);
    }
});

router.get("/sendTicket", auth, isAdminEventAuthor, async (req, res, next) => {
    try {
        const results = await emailService.sendTicket({
            attendeeId: req.query.attendeeId,
        });
        res.status(200).json(new ApiResponse("Ticket sent to email!", results));
    } catch (err) {
        next(err);
    }
});

router.get("/getFreeRegistrationConfirmation", async (req, res, next) => {
    try {
        const results = await registrationService.getFreeRegistrationConfirmation({
            registrationId: req.query.registrationId,
        });
        res.status(200).json(new ApiResponse("Free registration data retrieved!", results));
    } catch (err) {
        next(err);
    }
});

router.post("/sendTicketToEmail", async (req, res, next) => {
    try {
        const results = await emailService.sendTicket({
            registrationId: req.body.registrationId,
        });
        res.status(200).json(new ApiResponse("Ticket sent to email!", results));
    } catch (err) {
        next(err);
    }
});

router.post("/sendTicketToEmailByQrUuid", async (req, res, next) => {
    try {
        const results = await emailService.sendTicket({
            registrationId: req.body.registrationId,
        });
        res.status(200).json(new ApiResponse("Ticket sent to email!", results));
    } catch (err) {
        next(err);
    }
});

router.post(
    "/scanByExtrasPurchaseId",
    auth,
    isAdminEventAuthor,
    async (req, res, next) => {
        try {
            const results = await registrationService.scanByExtrasPurchaseId({
                ...req.body.payload,
            });
            res.status(200).json(new ApiResponse("Ticket sent to email!", results));
        } catch (err) {
            next(err);
        }
    },
);

// Cleanup expired data (admin only)
router.post("/cleanup", auth, isAdminEventAuthor, async (req, res, next) => {
    try {
        const result = await registrationService.runCleanupJob();
        res.status(200).json(new ApiResponse(null, result));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
