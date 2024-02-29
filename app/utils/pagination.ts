export const pagination = (count: any, page: any, pageSize: any, items: any) => {
  const totalPages = Math.ceil(count / +pageSize);
  return {
    currentPage: page,
    pageSize: pageSize,
    totalItems: count,
    totalPages: totalPages,
    items,
  };
};
