/**
 *
 * @param {Array} array Array to paginate
 * @param {number} limit Limit of results per page - Default 15
 * @param {number} page Results page
 */

const paginate = (array, limit = 15, page) => {
  const pageNum = page - 1;
  return array.slice(pageNum * limit, (pageNum + 1) * limit);
};

export default paginate;
