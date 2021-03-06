// @flow
/**
 *
 * Popover
 *
 */
import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import styles from './Popover.style';
import type { Props, State } from './types';

class Popover extends PureComponent<Props, State> {
  static defaultProps = {
    isVisible: false,
    hidePopoverCloseBtn: false,
  };

  /**
   * showPopover: State to manage the visibility of Popover content
   * default is false which can be changed by passing isVisible prop
   */
  state: State = {
    showPopover: false,
  };

  /**
   * wrapperRef: It represents the wrapper containing the element around
   * which popover needs to be wrapped and the popover content managed by
   * showPopover state or isVisible prop
   */
  wrapperRef: { current: null | HTMLDivElement } = createRef();

  /**
   * @componentDidMount
   * Add event listener to handle click outside the wrapper to that popover
   * gets closed and setting showPopover state on the basis of prop if passed
   */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);

    const { isVisible } = this.props;
    if (isVisible) {
      this.setState({
        showPopover: isVisible,
      });
    }
  }

  /**
   * @componentWillUnmount
   * Remove all event listener on component un-mounting
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  /**
   * @handleClickOutside
   * @param {MouseEvent} e
   * This function handles the outside click from the wrapper
   * to close the popover if open
   */
  handleClickOutside = (e: MouseEvent) => {
    const el = e.target;
    if (
      this.wrapperRef &&
      this.wrapperRef.current &&
      el instanceof Node &&
      !this.wrapperRef.current.contains(el)
    ) {
      this.setState({
        showPopover: false,
      });
    }
  };

  /**
   * @handleClick
   * This function handles the click of child element (like button/anchor etc)
   * on which popover needs to be open
   */
  handleClick = () => {
    this.setState({
      showPopover: true,
    });
  };

  /**
   * @close
   * This function closes the popover on when cross button
   * inside the popover gets clicked
   */
  close = () => {
    this.setState({
      showPopover: false,
    });
  };

  render() {
    const { popOverHeader, children, hidePopoverCloseBtn, className, trigger } = this.props;
    const { showPopover } = this.state;

    /**
     * Cloning of element needs to be done so that handleClick function can
     * be wrapped around element without wrapping it around another element
     * or creating an extra DOM node
     */
    const element = trigger && React.cloneElement(trigger, { onClick: this.handleClick });

    return (
      <div
        role="presentation"
        ref={this.wrapperRef}
        className={classnames('popover-wrap', className)}
      >
        {element}
        {showPopover && (
          <div role="dialog" className="popover">
            {!hidePopoverCloseBtn && (
              <button className="popover__close" onClick={this.close}>
                X
              </button>
            )}
            {popOverHeader && <h3 className="popover__header">{popOverHeader}</h3>}
            <div className="popover__body">{children}</div>
          </div>
        )}
      </div>
    );
  }
}

export default styled(Popover)`
  ${styles};
`;

export { Popover as PopoverVanilla };
