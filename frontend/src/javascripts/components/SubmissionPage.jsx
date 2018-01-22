import React from "react";

import UscisApiService from "../services/UscisApiService";

class SubmissionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submission: {
        uri: "http://via.placeholder.com/350x150",
      }
    };
  }

  componentDidMount() {
    const { params: { id } } = this.props.match;
    UscisApiService
      .getSubmission(id)
      .then(submission => {
        this.setState({ submission });
      });
  }

  renderSubmission = () => {
    const { submission } = this.state;

    return (
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
    );
  };

  renderCustomer = () => {
    const { customer } = this.state.submission;

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
