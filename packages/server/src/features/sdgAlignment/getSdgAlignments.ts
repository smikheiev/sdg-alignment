export default function getSdgAlignments(companyId: string) {
  return {
    company: {
      id: companyId,
      name: 'Milk bar',
    },
    sdgAlignments: [
      {
        sdgId: 1,
        alignment: {
          score: 1.2,
          status: 'aligned' as const,
        },
      },
      {
        sdgId: 2,
        alignment: {
          score: 2.0,
          status: 'aligned' as const,
        },
      },
      {
        sdgId: 3,
        alignment: {
          score: -2,
          status: 'aligned' as const,
        },
      },
      {
        sdgId: 4,
        alignment: {
          score: -1.4,
          status: 'aligned' as const,
        },
      },
      {
        sdgId: 5,
        alignment: {
          score: 1.5,
          status: 'aligned' as const,
        },
      },
    ],
  }
}
