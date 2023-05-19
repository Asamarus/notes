import type { Note as NoteData } from 'store/NotesSlice';

import { Anchor, BackgroundImage, Stack } from '@mantine/core';
import useStyles from './SourcesList.styles';
import isEmpty from 'helpers/isEmpty';

export interface SourcesListProps {
  /** Note */
  note: NoteData;
}

function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

// To address those who want the "root domain," use this function:
function extractRootDomain(url) {
  let domain = extractHostname(url);
  const splitArr = domain.split('.');
  const arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
}

function SourcesList({ note }: SourcesListProps) {
  const { classes } = useStyles();

  const sources = note.sources;

  if (!Array.isArray(sources)) {
    return null;
  }

  return (
    <Stack spacing={15}>
      {sources.map((source) => (
        <Anchor
          key={source.id}
          href={source.link}
          target="_blank"
          variant="text"
          className={classes.wrapper}>
          {!isEmpty(source.image) && source.showImage && (
            <div className={classes.image}>
              <BackgroundImage src={source.image} sx={{ width: 56, height: 56 }} />
            </div>
          )}
          <div className={classes.info}>
            <div className={classes.title}>{source.title}</div>
            <div className={classes.domain}>{extractRootDomain(source.link)}</div>
          </div>
        </Anchor>
      ))}
    </Stack>
  );
}

export default SourcesList;
