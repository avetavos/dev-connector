import React, { useState, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile } from '../../actions/profile';

const CreateProfile = ({ createProfile, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    github: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const {
    company,
    website,
    location,
    status,
    skills,
    github,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history);
  };

  return (
    <div>
      <h1 className='large text-primary'>Create Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <div className='my-2'>
        <form className='form' onSubmit={e => onSubmit(e)}>
          <select name='status' value={status} onChange={e => onChange(e)}>
            <option value='0'>* Select Professional Status</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Student or Learning'>Student or Learning</option>
            <option value='Teacher or Instructor'>Instructor</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>
            Give us an idea of where you are at in your career
          </small>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Company'
              name='company'
              onChange={e => onChange(e)}
              value={company}
            />
            <small className='form-text'>
              Could br your own company or one you work for
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Website'
              name='website'
              onChange={e => onChange(e)}
              value={website}
            />
            <small className='form-text'>
              Could be you oen or company website
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Location'
              name='location'
              onChange={e => onChange(e)}
              value={location}
            />
            <small className='form-text'>
              City & state suggested (eg. Boston, MA)
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Skills'
              name='skills'
              onChange={e => onChange(e)}
              value={skills}
            />
            <small className='form-text'>
              Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
            </small>
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='GitHub Username'
              name='github'
              onChange={e => onChange(e)}
              value={github}
            />
            <small className='form-text'>
              If you want your latest repos and a GitHub link, include your
              username
            </small>
          </div>
          <div className='form-group'>
            <textarea
              name='bio'
              placeholder='A short bio of yourself'
              name='bio'
              onChange={e => onChange(e)}
              value={bio}
            />
          </div>
          <div className='my-2'>
            <button
              type='button'
              className='btn btn-light'
              onClick={() => toggleSocialInputs(!displaySocialInputs)}
            >
              Add Social Network Links
            </button>
          </div>
          {displaySocialInputs && (
            <Fragment>
              <div className='form-group social-input'>
                <i className='fab fa-twitter fa-2x'></i>
                <input
                  type='text'
                  placeholder='Twitter URL'
                  name='twitter'
                  onChange={e => onChange(e)}
                  value={twitter}
                />
              </div>
              <div className='form-group social-input'>
                <i className='fab fa-facebook fa-2x'></i>
                <input
                  type='text'
                  placeholder='Facebook URL'
                  name='facebook'
                  onChange={e => onChange(e)}
                  value={facebook}
                />
              </div>
              <div className='form-group social-input'>
                <i className='fab fa-youtube fa-2x'></i>
                <input
                  type='text'
                  placeholder='YouTube URL'
                  name='youtube'
                  onChange={e => onChange(e)}
                  value={youtube}
                />
              </div>
              <div className='form-group social-input'>
                <i className='fab fa-linkedin fa-2x'></i>
                <input
                  type='text'
                  placeholder='Linkedin URL'
                  name='linkedin'
                  onChange={e => onChange(e)}
                  value={linkedin}
                />
              </div>
              <div className='form-group social-input'>
                <i className='fab fa-instagram fa-2x'></i>
                <input
                  type='text'
                  placeholder='Instagram URL'
                  name='instagram'
                  onChange={e => onChange(e)}
                  value={instagram}
                />
              </div>
            </Fragment>
          )}
          <button type='submit' className='btn btn-primary my-1'>
            Submit
          </button>
          <Link to='/dashboard' className='btn btn-light my-1'>
            Go Back
          </Link>
        </form>
      </div>
    </div>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(
  null,
  { createProfile }
)(withRouter(CreateProfile));
