const express = require("express");
const router = require("express").Router();
const stripeService = require("../service/stripe");
const ApiResponse = require("../model/ApiResponse");

// Create secure payment intent with backend validation
router.post("/create-secure-payment-intent", async (req, res, next) => {
    try {
        const result = await stripeService.createSecurePaymentIntent(req.body);

        res.status(200).json(new ApiResponse(null, {
            clientSecret: result.paymentIntent.client_secret,
            totalAmount: result.totalAmount,
            sessionId: result.sessionId,
        }));
    } catch (error) {
        next(error);
    }
});

// Check payment status and get processed registration data
router.get("/check-payment-status", async (req, res, next) => {
    try {
        const result = await stripeService.checkPaymentStatus({
            paymentIntent: req.query.paymentIntent
        });

        res.status(200).json(new ApiResponse(null, result));
    } catch (error) {
        next(error);
    }
});

// Webhook for handling payment intent events
const webhook = async (req, res, next) => {
    stripeService
        .webhook(req)
        .then((result) => {
            res.status(200).json(new ApiResponse(result, null));
        })
        .catch((err) => next(err));
};

module.exports = { router, webhook };
