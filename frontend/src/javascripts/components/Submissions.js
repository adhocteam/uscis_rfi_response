import React from "react";
import { Link } from "react-router-dom";

import UscisApiService from "../services/UscisApiService";

class Submissions extends React.Component {
  state = { submissions: null };

  componentDidMount() {
    this.getSubmissions();
  }

  getSubmissions = () => {
    UscisApiService
      .getSubmissions()
      .then(submissions => { this.setState({ submissions }) })
      .catch(err => { console.error(err); });
  };

  render() {
    const { submissions } = this.state;
    const submissionRows =
      submissions && submissions.map(submission => (
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
      <table>
        <thead>
          <th>Submission</th>
          <th>Status</th>
        </thead>
        <tbody>
          {submissionRows}
        </tbody>
      </table>
    ) : <p>No submissions found!</p>;
  }
}

export default Submissions;

