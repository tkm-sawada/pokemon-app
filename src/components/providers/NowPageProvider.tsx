import { createContext, useState, ReactNode, FC, Dispatch, SetStateAction } from 'react';

export const NowPageContext = createContext(
	{} as {
		nowPage: number;
		setNowPage: Dispatch<SetStateAction<number>>;
	}
);

type Props = {
  children: ReactNode ;
}

export const NowPageProvider: FC<Props> = (props) => {
  const { children } = props;
  
  const [nowPage, setNowPage] = useState(0);

  return (
    <NowPageContext.Provider value={{nowPage, setNowPage}}>
      { children }
    </NowPageContext.Provider>
  );
};