// pages/api/notaires/[address].js
import dbConnect from "../../../lib/mongodb";
import Verifier from "../../../models/verifier";

export default async (req, res) => {
  const {
    query: { address },
    method,
  } = req;

  await dbConnect();

  const wallet = address;

  switch (method) {
    case "GET":
      try {
        const verifier = await Verifier.findOne({ wallet });
        if (!verifier) {
          return res
            .status(404)
            .json({ success: false, message: "Verifier not found" });
        }
        res.status(200).json({ success: true, data: verifier });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
};
