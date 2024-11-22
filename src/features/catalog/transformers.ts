
export function validateFiltersToRequest(query: Record<string, string | void>) {
  return Object.keys(query).reduce(
    (acc, key) => {
      switch (key) {
        // case 'sort': {
        //   const values = query[key as FilterFields];

        //   if (values && !excludedSortFilterValues.includes(values)) {
        //     return {
        //       ...acc,
        //       [key]: values,
        //     };
        //   }

        //   return acc;
        // }

        default: {
          const values = query[key];

          if (values && key) {
            return {
              ...acc,
              [key]: values,
            };
          }

          return acc;
        }
      }
    },
    {} as Record<string, string>,
  );
}
