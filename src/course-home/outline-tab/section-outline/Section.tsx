import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton } from '@openedx/paragon';
import { Minus, Plus } from '@openedx/paragon/icons';

import { useModel } from '../../../generic/model-store';
import genericMessages from '../../../generic/messages';
import { useContextId } from '../../../data/hooks';
import messages from '../messages';
import SectionTitle from './SectionTitle';
import SequenceLink from './SequenceLink';

interface Props {
  defaultOpen: boolean;
  expand: boolean;
  section: {
    complete: boolean;
    sequenceIds: string[];
    title: string;
    hideFromTOC: boolean;
  };
}

const Section: React.FC<Props> = ({
  defaultOpen,
  expand,
  section,
}) => {
  const intl = useIntl();
  const courseId = useContextId();
  const {
    complete,
    sequenceIds,
    title,
    hideFromTOC,
  } = section;
  const {
    courseBlocks: {
      sequences,
    },
  } = useModel('outline', courseId);

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className="mb-2">
      <div className="custom-accordion-card card pgn__card">
        <div 
          className="custom-accordion-header d-flex justify-content-between align-items-center p-3"
          style={{ 
            cursor: 'pointer',
            borderBottom: open ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            backgroundColor: open ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
          }}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <div className="flex-grow-1">
            <SectionTitle {...{ complete, hideFromTOC, title }} />
          </div>
          <div className="ml-3">
            <IconButton
              alt={open ? intl.formatMessage(genericMessages.close) : intl.formatMessage(messages.openSection)}
              iconAs={open ? Minus : Plus}
              onClick={(e) => { 
                e.stopPropagation(); 
                setOpen(!open); 
              }}
              size="sm"
            />
          </div>
        </div>
        
        {open && (
          <div className="custom-accordion-body p-3">
            <ol className="list-unstyled m-0">
              {sequenceIds.map((sequenceId, index) => (
                <SequenceLink
                  key={sequenceId}
                  id={sequenceId}
                  sequence={sequences[sequenceId]}
                  first={index === 0}
                />
              ))}
            </ol>
          </div>
        )}
      </div>
    </li>
  );
};

export default Section;
