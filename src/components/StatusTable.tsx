
type Props = {
  status: Status;
}

const StatusTable = (props: Props) => {
  const {status} = props;
  const percentageOfHp: string = String(Math.round((status.hp / 255) * 100)) + '%';
  const percentageOfAttack: string = String(Math.round((status.attack / 255) * 100)) + '%';
  const percentageOfDefense: string = String(Math.round((status.defense / 255) * 100)) + '%';
  const percentageOfSpecialAttack: string = String(Math.round((status.specialAttack / 255) * 100)) + '%';
  const percentageOfSpecialDefense: string = String(Math.round((status.specialDefense / 255) * 100)) + '%';
  const percentageOfSpeed: string = String(Math.round((status.speed / 255) * 100)) + '%';

  return (
    <table className="w-full my-6 shadow overflow-hidden rounded border-gray-200">
      <tbody>
        <tr>
          <th className="w-2/6 text-center py-2 bg-gray-200">HP</th>
          <td className="w-1/6 text-left py-2 pl-8 pr-4">{status.hp}</td>
          <td className="w-3/6 text-left py-2">
            <div style={{width: percentageOfHp}} className="bg-gray-600 h-4 rounded" />
          </td>
        </tr>
        <tr>
          <th className="w-2/6 text-center py-2 bg-gray-200">こうげき</th>
          <td className="w-1/6 text-left py-2 pl-8">{status.attack}</td>
          <td className="w-3/6 text-left py-2">
            <div style={{width: percentageOfAttack}} className="bg-gray-600 h-4 rounded" />
          </td>
        </tr>
        <tr>
          <th className="w-2/6 text-center py-2 bg-gray-200">ぼうぎょ</th>
          <td className="w-1/6 text-left py-2 pl-8">{status.defense}</td>
          <td className="w-3/6 text-left py-2">
            <div style={{width: percentageOfDefense}} className="bg-gray-600 h-4 rounded" />
          </td>
        </tr>
        <tr>
          <th className="w-2/6 text-center py-2 bg-gray-200">とくこう</th>
          <td className="w-1/6 text-left py-2 pl-8">{status.specialAttack}</td>
          <td className="w-3/6 text-left py-2">
            <div style={{width: percentageOfSpecialAttack}} className="bg-gray-600 h-4 rounded" />
          </td>
        </tr>
        <tr>
          <th className="w-2/6 text-center py-2 bg-gray-200">とくぼう</th>
          <td className="w-1/6 text-left py-2 pl-8">{status.specialDefense}</td>
          <td className="w-3/6 text-left py-2">
            <div style={{width: percentageOfSpecialDefense}} className="bg-gray-600 h-4 rounded" />
          </td>
        </tr>
        <tr>
          <th className="w-2/6 text-center py-2 bg-gray-200">すばやさ</th>
          <td className="w-1/6 text-left py-2 pl-8">{status.speed}</td>
          <td className="w-3/6 text-left py-2">
            <div style={{width: percentageOfSpeed}} className="bg-gray-600 h-4 rounded" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default StatusTable;