import * as _ from 'lodash';
import * as React from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import * as groups from '../../data/groups.json';
import { debounce, getUrl } from '../utils';

@observer
export default class VoteManagerControls extends Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      showWizardModal: false
    };
  }

  openModal(modal) {
    if (modal === 'wizard') {
      this.setState({ showWizardModal: true });
    }
  }

  closeModal(modal) {
    if (modal === 'wizard') {
      this.setState({ showWizardModal: false });
    }
  }

  showGroup(key) {
    if (this.props.store.shownGroup !== key) {
      this.props.searchInPages(groups[key].data)
        .then(res => {
          this.props.store.setDelegates(res);
          this.props.store.showGroup(key);
        })
        .catch(err => console.warn(err));
    } else {
      this.props.navigate(this.props.store.selectedPage);
    }
  }

  selectPreset(key) {
    const delegates = groups[key].data;
    this.props.store.toggleDelegates(delegates, key);
  }

  resetSelectedDelegates() {
    this.props.store.setSelectedDelegates(this.props.store.initialVotes);
  }

  wipeSelectedDelegates() {
    this.props.store.setSelectedDelegates([]);
  }

  selectCurrentPage() {
    this.props.store.setSelectedDelegates(_.uniq([...this.props.store.selectedDelegates,
      ...this.props.store.delegates.map(dg => dg.username)]));
  }

  deselectCurrentPage() {
    const filtered = this.props.store.selectedDelegates.filter(username =>
      !this.props.store.delegates.find(dg => dg.username === username));
    this.props.store.setSelectedDelegates(filtered);
  }

  setSelectedToSharers() {
    const payoutsharers = _.uniq([...groups.elite.data, ...groups.shw.data, ...groups.dutchpool.data, ...groups.ascend.data, ...groups.alepop5an1ty.data, 'gdtpool', 'liskpool.top', 'liskpool_com_01', 'shinekami', 'communitypool', 'liskpoland.pl', 'thepool', 'endro', 'devasive', 'elevate', 'samuray', 'vrlc92', 'vipertkd', 'liskaustralia', 'hagie', 'kushed.delegate', 'vi1son', 'phoenix1969', 'stellardynamic', 'philhellmuth', 'sgdias']);
    this.closeModal('wizard');
    this.props.store.setSelectedDelegates(payoutsharers);
  }

  setSelectedToContrib() {
    const payoutcontrib = _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, ...groups.builders.data, 'phoenix1969', 'stellardynamic']);
    this.closeModal('wizard');
    this.props.store.setSelectedDelegates(payoutcontrib);
  }

  setSelectedToMaximum() {
    const payoutmax = _.uniq([...groups.gdt.data, ...groups.elite.data, ...groups.shw.data, 'thepool', 'liskpool_com_01', 'liskpool.top', 'shinekami', 'vipertkd', 'vrlc92', 'communitypool', 'devasive', 'samuray', 'stellardynamic', 'phoenix1969']).filter(e => ['bitbanksy','4fryn','bloqspace.io'].indexOf(e) === -1);
    this.closeModal('wizard');
    this.props.store.setSelectedDelegates(payoutmax);
  }

  renderFilters() {
    return Object.keys(groups).map(key => {
      const { fullname, tooltip } = groups[key];
      return (
        <div className="column col-4 col-xs-6" key={key}>
          <label className={`form-switch ${tooltip ? 'tooltip' : ''}`} data-tooltip={tooltip}>
            <input type="checkbox" checked={this.props.store.selectedSets.includes(key)} onChange={() => this.selectPreset(key)} />
            <i className="form-icon"></i> { fullname }
          </label>
          <button className="btn btn-link btn-sm" onClick={() => this.showGroup(key)}>{ this.props.store.shownGroup === key ? 'Hide' : 'Show' }</button>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="columns" id="intro-filters-block">
          { this.renderFilters() }
        </div>
        <div className="divider" />
        <div className="btn-group btn-group-block">
          <button className="btn btn-secondary" id="intro-restore-btn" onClick={() => this.resetSelectedDelegates()}>Restore</button>
          <button className="btn btn-secondary" id="intro-unvote-btn" onClick={() => this.wipeSelectedDelegates()}>Unvote All</button>
          <button className="btn btn-secondary" id="intro-wizard-btn" onClick={() => this.openModal('wizard')}>Vote Wizard</button>
          <button className="btn btn-secondary" id="intro-selectpage-btn" onClick={() => this.selectCurrentPage()}>Select Current Page</button>
          <button className="btn btn-secondary" id="intro-deselectpage-btn" onClick={() => this.deselectCurrentPage()}>Deselect Current Page</button>
        </div>
        <div className={`modal ${this.state.showWizardModal ? 'active' : ''}`} id="modal-id">
          <a href="#close" className="modal-overlay" aria-label="Close"></a>
          <div className="modal-container">
            <div className="modal-header">
              <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.closeModal('wizard')}></a>
              <div className="modal-title h5">Vote Wizard</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <button className="btn btn-secondary btn-block" onClick={() => this.setSelectedToMaximum()}>Vote for Maximum Payouts (100% Earnings)</button>
                <div className="divider text-center" data-content="OR"></div>
                <button className="btn btn-secondary btn-block" onClick={() => this.setSelectedToContrib()}>Vote for Lisk Contributors (92% Earnings)</button>
                <div className="divider text-center" data-content="OR"></div>
                <button className="btn btn-secondary btn-block" onClick={() => this.setSelectedToSharers()}>Vote for Highest Sharing Delegates (75% Earnings)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
