import * as React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import groups from '../../data/groups.json';

@observer
export default class VoteManagerTable extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  isSelected(delegateUsername) {
    return this.props.store.selectedDelegates
      .find(username => username === delegateUsername) !== undefined;
  }

  renderRow = (delegate) => {
    let bonus = delegate.groups.reduce((mem, gp) => {
      return gp.nobonus.find(username => username === delegate.username) ? 0 : mem + gp.bonus;
    }, 0);
    // Exception for joel while dpos-tools-data is broken
    if (delegate.username === 'joel') {
      bonus = 0;
    }
    const modPercentage = delegate.percentage;
    // Exception for joel while dpos-tools-data is broken
    const toggleDelegate = () => this.props.store.toggleDelegate(delegate);
    const own = 100 - bonus - modPercentage;
    return (
      <tr key={delegate.rank} className={this.isSelected(delegate.username) ? 'active' : undefined} onClick={toggleDelegate}>
        <td>
          <input type="checkbox" checked={this.isSelected(delegate.username)} onChange={() => true} />
          <i className="form-icon" />
        </td>
        <td>{delegate.rank}</td>
        <td>{delegate.username}</td>
        <td>
        {
          delegate.groups.length > 0 ? delegate.groups.map((gp, i) => {
            return (<span key={i} className={`chip ${groups[gp.group].color}`}>{groups[gp.group].tag}</span>);
          }) : (<span>&nbsp;</span>)
        }
        </td>
        <td>
          <div className="bar tooltip" data-tooltip={`Shares ${modPercentage}% / Pools ${bonus}% / Keeps ${own}%`}>
            <div className="bar-item" style={{ width: `${modPercentage}%`, backgroundColor: '#5764c6' }} />
            <div className="bar-item" style={{ width: `${bonus}%`, backgroundColor: '#818bd5' }} />
            <div className="bar-item" style={{ width: `${own}%`, backgroundColor: '#abb1e2' }} />
          </div>
        </td>
        <td>{`${delegate.productivity}%`}</td>
        <td>{`${delegate.approval}%`}</td>
      </tr>
    );
  };

  render() {
    return (
      <table className="table table-scroll table-striped table-hover col-12">
        <thead>
          <tr>
            <th />
            <th>rank</th>
            <th>username</th>
            <th>groups</th>
            <th>share</th>
            <th>productivity</th>
            <th>approval</th>
          </tr>
        </thead>
        <tbody>
          { this.props.store.delegates.map(this.renderRow) }
        </tbody>
      </table>
    );
  }
}
