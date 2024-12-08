import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Props = {
  sdgAlignments: Array<{
    sdgId: number
    alignment: {
      score: number
      status: string
    } | null
  }>
}

export default function SdgAlignmentsChart(props: Props) {
  const data = props.sdgAlignments.map((sdgAlignment) => ({
    label: `SDG ${sdgAlignment.sdgId}`,
    alignmentScore: sdgAlignment.alignment
      ? Number(sdgAlignment.alignment.score.toFixed(2))
      : undefined,
    alignmentStatus: sdgAlignment.alignment?.status,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis
          dataKey="label"
          allowDataOverflow={true}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="alignmentScore" fill={'#8884d8'}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.alignmentScore !== undefined &&
                Number(entry.alignmentScore) >= 0
                  ? '#4CAF50'
                  : '#F44336'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
