import React from "react";

import UscisApiService from "../services/UscisApiService";

class Submission extends React.Component {
  state = { submission: null };

  componentDidMount() {
    const { params: { id } } = this.props.match;
    UscisApiService
      .getSubmission(id)
      .then(submission => this.setState({ submission }))
      .catch(err => { console.error(err); });
  }

  handleNotesChange = (e) => {
    this.setState({
      submission: { ...this.state.submission, notes: e.target.value }
    });
  };

  handleStatusChange = (e) => {
    this.setState({
      submission: { ...this.state.submission, status: e.target.value }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    UscisApiService
      .updateSubmission(this.state.submission)
      .catch(err => { console.error(err); });
  };

  renderSubmission = () => {
    const { submission } = this.state;
    return submission ? (
      <section>
        <img alt={`UUID: ${submission.id}`} src={submission.uri} />
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="notes">Notes</label>
              <br />
              <textarea
                  id="notes"
                  name="notes"
                  value={submission.notes}
                  onChange={this.handleNotesChange} />
            </div>
            <div>
              <input
                  id="approve"
                  type="radio"
                  name="status"
                  value="approved"
                  checked={submission.status === "approved"}
                  onChange={this.handleStatusChange} />
              <label htmlFor="approve">Approve</label>
              <br />
              <input
                  id="deny"
                  type="radio"
                  name="status"
                  value="denied"
                  checked={submission.status === "denied"}
                  onChange={this.handleStatusChange} />
              <label htmlFor="deny">Deny</label>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </section>
    ) : <p>No submission found!</p>;
  };

  renderCustomer = () => {
    const { submission } = this.state;
    if (!submission) { return null; }

    const { customer } = submission;
    return customer ? (
      <section>
        <div>Name: {customer.name}</div>
        <div>Email: {customer.email}</div>
      </section>
    ) : <p>No customer found!</p>;
  }

  render() {
    return (
      <div>
        {this.renderSubmission()}
        {this.renderCustomer()}
      </div>
    );
  }
}

export default Submission;
