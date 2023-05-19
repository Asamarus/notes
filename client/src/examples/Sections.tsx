import { useAppSelector, useAppDispatch } from 'hooks';
import { useEffect } from 'react';
import { setSections, selectSections } from 'store/SectionsSlice';

function Sections() {
  const sections = useAppSelector(selectSections);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setSections([
        {
          id: 4,
          sync_id: '1lvc1cjwlcb1w81m',
          created_at: '2022-12-30T23:52:25.000+02:00',
          updated_at: '2022-12-30T23:52:30.000+02:00',
          name: 'it',
          display_name: 'IT',
          color: '#f9a825',
          position: 0,
        },
        {
          id: 1,
          sync_id: '1lvc1cpolc876oo7',
          created_at: '2022-12-28T23:57:12.000+02:00',
          updated_at: '2022-12-30T23:52:30.000+02:00',
          name: 'front_end',
          display_name: 'Front-end',
          color: '#4caf50',
          position: 1,
        },
      ]),
    );
  }, []);

  return (
    <>
      {sections.map((section) => (
        <div key={section.id}>{section.name}</div>
      ))}
    </>
  );
}

export default Sections;
