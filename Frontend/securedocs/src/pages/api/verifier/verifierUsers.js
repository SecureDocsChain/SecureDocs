import dbConnect from "../../../lib/mongodb";
import Verifier from "../../../models/verifier";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const verifierUsers = await Verifier.find({}); // Find all verifier users
        res.status(200).json({ success: true, data: verifierUsers });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      const {
        wallet,
        occupation,
        email,
        name,
        address,
        phoneNumber,
        kbisNumber,
        professionalInfo,
        kycStatus,
      } = req.body;

      try {
        // No need to connect again if dbConnect() is used
        const newVerifier = new Verifier({
          wallet,
          occupation,
          email,
          name,
          address,
          phoneNumber,
          kbisNumber,
          professionalInfo,
          kycStatus,
        });

        await newVerifier.save();
        res.status(201).json({
          success: true,
          message: "Verifier created successfully",
          data: newVerifier,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error creating verifier",
          error: error.message,
        });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
