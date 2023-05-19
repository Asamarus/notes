import { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import find from 'lodash/find';
import Note from 'common/note';
import NavBar from './components/nav_bar';
import { useParams, useNavigate } from 'react-router-dom';
import { setCurrentSection } from 'store/CurrentSectionSlice';
import { setNotes } from 'store/NotesSlice';

function NotePage() {
  const dispatch = useAppDispatch();
  const { section, id } = useParams<{ section: string; id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

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

  if (loading) {
    return null;
  }

  return (
    <>
      <NavBar />
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : '#fff',
        })}>
        <Note
          id={Number(id)}
          tab="view"
          onCloseModal={() => {
            navigate(`/${section}`);
          }}
          type="page"
        />
      </Box>
    </>
  );
}

export default NotePage;
