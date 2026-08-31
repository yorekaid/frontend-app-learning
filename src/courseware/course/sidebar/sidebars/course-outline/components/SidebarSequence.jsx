import {
  CourseOutlineSidebarCompletionIconSlot,
} from '@src/plugin-slots/CourseOutlineSidebarCompletionIconSlot';
import { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { ExpandMore, ExpandLess } from '@openedx/paragon/icons';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { useCourseOutlineSidebar } from '../hooks';
import SidebarUnit from './SidebarUnit';
import { UNIT_ICON_TYPES } from './UnitIcon';

const SidebarSequence = ({
  courseId,
  defaultOpen,
  sequence,
  activeUnitId,
}) => {
  const intl = useIntl();
  const {
    id,
    complete,
    title,
    specialExamInfo,
    unitIds,
    type,
    completionStat,
  } = sequence;

  const [open, setOpen] = useState(defaultOpen);
  const { activeSequenceId, units, isEnabledCompletionTracking } = useCourseOutlineSidebar();
  const isActiveSequence = id === activeSequenceId;

  const sectionTitle = (
    <>
      <div className="col-auto p-0" style={{ fontSize: '1.1rem' }}>
        <CourseOutlineSidebarCompletionIconSlot
          variant="sequence"
          completionStat={completionStat}
          enabled={isEnabledCompletionTracking}
          active={isActiveSequence}
        />
      </div>
      <div className="col-9 d-flex flex-column flex-grow-1 ml-3 mr-auto p-0 text-left">
        <span className="align-middle text-dark-500">{title}</span>
        {specialExamInfo && <span className="align-middle small text-muted">{specialExamInfo}</span>}
        {isEnabledCompletionTracking && (
          <span className="sr-only">
            , {intl.formatMessage(complete
            ? courseOutlineMessages.completedAssignment
            : courseOutlineMessages.incompleteAssignment)}
          </span>
        )}
      </div>
    </>
  );

  return (
    <li className={classNames('mb-2', { 'bg-info-100': isActiveSequence && !open })}>
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
          <div className="flex-grow-1 row w-100 m-0">
            {sectionTitle}
          </div>
          <div className="ml-3">
            <IconButton
              alt={open ? intl.formatMessage(courseOutlineMessages.collapseAll) : intl.formatMessage(courseOutlineMessages.expandAll)}
              iconAs={open ? ExpandLess : ExpandMore}
              onClick={(e) => { 
                e.stopPropagation(); 
                setOpen(!open); 
              }}
              size="sm"
            />
          </div>
        </div>

        {open && (
          <div className="custom-accordion-body p-3 border-top border-light">
            <ol className="list-unstyled m-0">
              {unitIds.map((unitId, index) => (
                <SidebarUnit
                  key={unitId}
                  id={unitId}
                  courseId={courseId}
                  sequenceId={id}
                  unit={units[unitId]}
                  isActive={activeUnitId === unitId}
                  activeUnitId={activeUnitId}
                  isFirst={index === 0}
                  isLocked={type === UNIT_ICON_TYPES.lock}
                  isCompletionTrackingEnabled={isEnabledCompletionTracking}
                />
              ))}
            </ol>
          </div>
        )}
      </div>
    </li>
  );
};

SidebarSequence.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  sequence: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    specialExamInfo: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
};

export default SidebarSequence;
