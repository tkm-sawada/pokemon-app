import { memo, useContext } from 'react';
import { NowPageContext } from './providers/NowPageProvider';

type Props = {
  pages: number[];
  handleMovePage: (props: handleMovePageProps) => void;
}

const PageButton = memo((props: Props) => {
  const { pages, handleMovePage } = props;
  const { nowPage } = useContext(NowPageContext);

  return (
    <div className="flex justify-center">
      <div className="w-4/5 my-20 flex flex-row justify-center">
        {pages.map((pageNum: number, i: number) => {
          return (
            pageNum === nowPage ? (
              <button key={i} className="flex-1 mx-4 py-3 px-4 text-white bg-gray-800 border-0 hover:bg-gray-500 rounded-xl text-xl shadow-2xl pointer-events-none" disabled>{pageNum}</button>
            ) : (
              <button key={i} onClick={() => handleMovePage({pageNum})} className="flex-1 mx-4 py-3 px-4 text-white bg-red-800 border-0 hover:bg-red-500 rounded-xl text-xl shadow-2xl">{pageNum}</button>
            )
          )
        })}
      </div>
    </div>
  )
})

export default PageButton