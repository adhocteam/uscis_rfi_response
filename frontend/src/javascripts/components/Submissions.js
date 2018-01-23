import React from "react";
import { Link } from "react-router-dom";
import ChoiceList from "@cmsgov/design-system-core/dist/components/ChoiceList/ChoiceList";
import UscisApiService from "../services/UscisApiService";

class Submissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submissions: null, filter: "submitted" };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getSubmissions();
  }

  handleChange(event) {
    this.setState({ filter: event.target.value });
  }

  // filters submissions
  handleSubmit(event) {
    event.preventDefault();
    UscisApiService.filterSubmissions(this.state.filter).then(s => {
      this.setState({ submissions: s });
    });
  }

  getSubmissions = () => {
    UscisApiService.getSubmissions()
      .then(submissions => {
        this.setState({ submissions });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { submissions } = this.state;
    const submissionRows =
      submissions &&
      submissions.map(submission => (
        <tr key={`submission-${submission.id}`}>
          <td>
            <Link to={`${this.props.match.url}/${submission.id}`}>
              {submission.id}
            </Link>
          </td>
          <td>{submission.status}</td>
        </tr>
      ));

    return submissions ? (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Submission status
            <select value={this.state.filter} onChange={this.handleChange}>
              <option value="requested">Requested</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
        <table>
          <thead>
            <tr>
              <th>Submission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{submissionRows}</tbody>
        </table>
      </div>
    ) : (
      <p>No submissions found!</p>
    );
  }
}

export default Submissions;
