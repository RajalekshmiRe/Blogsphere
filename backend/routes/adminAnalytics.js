const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const excelJS = require("exceljs");

router.get("/export-reports", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();
    const categories = await Category.countDocuments();

    const workbook = new excelJS.Workbook();
    const sheet = workbook.addWorksheet("Analytics Report");

    sheet.addRow(["Report", "Count"]);
    sheet.addRow(["Total Users", users]);
    sheet.addRow(["Total Blogs", blogs]);
    sheet.addRow(["Total Categories", categories]);

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", "attachment; filename=analytics.xlsx");

    res.send(buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;
