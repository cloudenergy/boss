import React from 'react'
const Nav = (props) => (
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">BOSS</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="/dashboard/">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/project">Project</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/account">Account</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/event">Event</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/finance">Finance</a>
        </li>
      </ul>
    </div>
  </nav>)
export default Nav
