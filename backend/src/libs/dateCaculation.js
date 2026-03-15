export const checkDate = async (items) => {
  try {
    if (!items || !Array.isArray(items)) return [];

    const todayUTC = new Date();
    const result = items.map(item => {
      if (!item.endDate) return { id: item.id, diffDays: 0 };

      const endUTC = new Date(item.endDate);
      const diffDays = Math.ceil((endUTC.getTime() - todayUTC.getTime()) / (1000*60*60*24));

      return { id: item.id, diffDays };
    });

    return result;

  } catch (error) {
    console.error("Error in checkDate:", error);
    return [];
  }
}
