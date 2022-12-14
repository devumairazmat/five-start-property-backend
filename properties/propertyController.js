const asyncHandler = require("express-async-handler");
const Property = require("./propertyModel");

const getProperties = asyncHandler(async (req, res) => {
  let { find, sort, page, limit } = req.body;
  page = parseInt(page);
  limit = parseInt(limit);
  let toSort;
  if (sort === "ascending") {
    toSort = { $natural: 1 };
  } else if (sort === "descending") {
    toSort = { $natural: -1 };
  } else {
    toSort = null;
  }
  // Pagination

  let pagination = {
    page,
  };
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (startIndex > 0) {
    pagination.previous = page - 1;
  }
  if (endIndex < (await Property.find(find).count())) {
    pagination.next = page + 1;
  }

  const properties = await Property.find(find)
    .sort(toSort)
    .skip(startIndex)
    .limit(limit);

  return res.status(200).json({
    status: 200,
    message: `successfully fetched properties`,
    pagination,
    properties,
  });
});
const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    location,
    description,
    status,
    area,
    beds,
    baths,
    price,
    image,
    imageId,
    userId,
  } = req.body;

  if (
    !title ||
    !location ||
    !description ||
    !status ||
    !area ||
    !beds ||
    !baths ||
    !price ||
    !image ||
    !imageId ||
    !userId
  ) {
    return res.status(400).json({
      message: "please include all fields",
    });
  }

  const property = await Property.create(req.body);
  if (property) {
    return res.status(201).json({
      status: 201,
      message: "property created successfully",
      property,
    });
  }
});
const updateProperty = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "id not found",
    });
  }
  const updatedOne = await Property.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    status: 200,
    message: "successfully updated",
    updatedOne,
  });
});
const deleteProperty = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "id not found",
    });
  }
  const deletedOne = await Property.findByIdAndDelete(id);
  return res.json({
    message: "successfully deleted",
    status: 200,
    deletedOne,
  });
});

module.exports = {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
