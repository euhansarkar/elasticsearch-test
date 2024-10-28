class QueryBuilder {
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //   search query
  search(searchableFields) {
    const { searchTerm } = this.query;

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({ [field]: searchRegex })),
      });
    }

    return this;
  }

  range(searchableFields) {
    const startRangeField = searchableFields?.startDateField || "createdAt";
    const endRangeField = searchableFields?.endDateField || "createdAt";
    const formatetedDateRange = this?.query?.dateRange.replace(/ /g, "+");
    const [startRange, endRange] = formatetedDateRange?.split(",") || [];

    if (startRange && endRange) {
      this.modelQuery = this.modelQuery.find({
        [startRangeField]: { $gte: startRange },
        [endRangeField]: { $lte: endRange },
      });
    } else if (startRange) {
      this.modelQuery = this.modelQuery.find({
        [startRangeField]: { $gte: startRange },
      });
    } else if (endRange) {
      this.modelQuery = this.modelQuery.find({
        [endRangeField]: { $lte: endRange },
      });
    }
    return this;
  }

  //   filter query
  filter() {
    const queryObject = { ...this.query };
    // remove fields from query
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "startRange",
      "endRange",
    ];

    excludeFields.forEach((el) => delete queryObject[el]);

    // Handle multi-field queries (comma-separated values)
    for (const [key, value] of Object.entries(queryObject)) {
      if (value.includes(",")) {
        const valuesArray = value.split(",");
        queryObject[key] = { $in: valuesArray }; // Use $in for multi-value filtering
      }
    }

    this.modelQuery = this.modelQuery.find(queryObject);
    return this;
  }

  //   sort query
  sort() {
    const sort = this?.query?.sort?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  // multiFields() {
  //   const { multiFields } = this.query;
  //   if (multiFields) {
  //     const fields = multiFields.split(",");
  //     fields.forEach((field) => {
  //       this.modelQuery = this.modelQuery.find({ [field]: { $in: field } });
  //     });
  //   }
  //   return this;
  // }

  //   limit query
  limit() {
    const limit =
      this?.query?.limit === "all"
        ? Number.MAX_SAFE_INTEGER
        : Number(this?.query?.limit) || 10;
    this.modelQuery = this.modelQuery.limit(limit);
    return this;
  }

  // pagination query
  paginate() {
    const page = Number(this?.query?.page) || 1;

    const limit =
      this?.query?.limit === "all"
        ? Number.MAX_SAFE_INTEGER
        : Number(this?.query?.limit) || 10;

    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // field limiting
  fields() {
    const fields = this?.query?.fields?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();

    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit =
      this?.query?.limit === "all" ? total : Number(this?.query?.limit) || 10;
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export default QueryBuilder;
