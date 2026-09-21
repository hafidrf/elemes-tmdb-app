import { CatalogKey } from '../../features/catalog/catalogConfig';

export type RootStackParamList = {
  Tabs: undefined;
  CategoryList: { categoryKey: CatalogKey };
  MovieDetail: { id: number; title: string };
  TvDetail: { id: number; title: string };
  PersonDetail: { id: number; name: string };
  Search: undefined;
};

export type RootTabParamList = {
  MoviesTab: undefined;
  TvTab: undefined;
  PeopleTab: undefined;
  WatchlistTab: undefined;
};
