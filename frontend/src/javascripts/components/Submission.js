import React from "react";

import UscisApiService from "../services/UscisApiService";

class SubmissionPage extends React.Component {
  state = {};

  componentDidMount() {
    const { params: { id } } = this.props.match;
    UscisApiService
      .getSubmission(id)
      .then(submission => this.setState({ submission }))
      .catch(err => { console.error(err); });
  }

  renderSubmission = () => {
    const { submission } = this.state;
    return submission ? (
      <section>
        <img alt={`UUID: ${submission.id}`} src={submission.uri} />
        <div>
          <div>Status: {submission.status}</div>
          <div>
            <label htmlFor="notes">Notes</label>
            <div>
              <textarea id="notes">{submission.notes}</textarea>
            </div>
          </div>
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

export default SubmissionPage;
