import { useEffect, useState } from 'react';
import Header from 'layout/header';
import NavigationBar from 'layout/navigation_bar';
import Sidebar from 'layout/sidebar';
import Content from 'layout/content';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'hooks';
import { store } from 'store';
import randomId from 'utils/random-id';
import find from 'lodash/find';
import { setCurrentSection } from 'store/CurrentSectionSlice';
import { setNavBarAutoComplete } from 'store/NavBarAutoCompleteSlice';
import { setNotes } from 'store/NotesSlice';
import isEmpty from 'helpers/isEmpty';

function NoteListPageWrapper() {
  const dispatch = useAppDispatch();
  const { section } = useParams<{ section: string }>();

  const [loading, setLoading] = useState(true);
  const current = useAppSelector((state) => state.CurrentSection);

  useEffect(() => {
    setLoading(true);

    if (isEmpty(section)) {
      dispatch(
        setCurrentSection({
          name: 'all',
          displayName: 'Notes',
          color: '#1e88e5',
        }),
      );
    } else {
      const sections = store.getState().Sections;
      const sectionData = find(sections, (s) => s.name === section);

      if (sectionData) {
        dispatch(
          setCurrentSection({
            name: sectionData.name,
            displayName: sectionData.display_name,
            color: sectionData.color,
          }),
        );
      }
    }

    dispatch(
      setNavBarAutoComplete({
        value: '',
        valueId: randomId(),
      }),
    );

    dispatch(
      setNotes({
        section: section === null ? 'all' : section,
        total: 0,
        ids: [],
        rows: {},
        search: '',
        book: '',
        tags: [],
        date: '',
        withoutBook: false,
        withoutTags: false,
        inRandomOrder: false,
        loading: false,
        count: 0,
        loadMore: false,
        page: 1,
        foundWholePhrase: false,
        keywords: [],
        searchTerm: '',
      }),
    );

    setLoading(false);
  }, [section]);

  return !loading && <NotesListPage key={current.name} />;
}

function NotesListPage() {
  return (
    <>
      <Header />
      <NavigationBar />
      <Sidebar />
      <Content />
    </>
  );
}

export default NoteListPageWrapper;
