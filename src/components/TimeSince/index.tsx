import * as React from 'react';
import { css } from '@emotion/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

const timeSince = (date: Timestamp): [minutes: number, seconds: number] => {
  const now = moment();
  const then = moment(date.toDate());
  const seconds = now.diff(then, 'seconds');

  return [Math.floor(seconds / 60), seconds % 60];
};

const waitToLiftCss = css`
  color: red;
`;

const wheneverCss = css`
  color: green;
`;

interface TimeSinceProps {
  date: Timestamp;
}

const TimeSince: React.FC<TimeSinceProps> = ({ date }) => {
  const [[minutes, seconds], setSince] = useState(timeSince(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(timeSince(date));
    }, 500);
    return () => clearInterval(interval);
  }, [date]);

  const sinceCss = useMemo(() => {
    if (minutes < 2) {
      return waitToLiftCss;
    }
    return wheneverCss;
  }, [minutes]);

  if (minutes > 20) {
    return <>{date.toDate().toLocaleTimeString()}</>;
  }

  return (
    <span css={sinceCss}>
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default TimeSince;
