---
marp: true
style: |

  section h1 {
    color: #6042BC;
  }

  section code {
    background-color: #e0e0ff;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
  }

  footer img {
    position: absolute;
    width: 120px;
    right: 20px;
    top: 0;

  }
  section #title-slide-logo {
    margin-left: -60px;
  }

---

# What if your app isn't hosted by Elixir?

---

# Websites (not web apps)
- Static site generators
- CMS platforms
- Other tech stacks

---

# Embedded web apps
- Adds functionality to a larger application
- Examples
  - Live support
  - Buy button
  - Comments
  - Surveys

---

# What's percentage of websites are served by Elixir?

---

# What's percentage of websites use HTML?

---

# What if we could build Live~~View~~ app with just HTML

---

# What do we *really* love about LiveView?
- We can write more of our app in Elixir
- Our front just renders state and sends event

---

# LiveState: LiveViewish goodness in HTML

---
# How does it work?
- An elixir library (live_state)
  - Channel behaviour to provide state
- A javascript library (phx-live-state)
  - Receives state from channel
  - Dispatches events to channel
  - I just stole the prefix cuz `live-state` npm was taken

---

# `live_state`

- The elixir library
- Add it to your deps
- `use LiveState.Channel` behaviour in your channel
- implement callbacks

---
## `init/3` to build initial state
- Receives:
  - channel
  - payload
  - socket
- Returns
  - `{:ok, state}`
  - state must be map of `Jason.Encoder` able things
  - pushes `state:change` to clients

---

## `handle_event/3` to handle events
- Receives
  - event name (`CustomEvent` name)
  - event payload (`CustomEvent` detail)
  - state (from socket assigns)
- Returns
  `{:noreply, new_state}`
  `{:reply, event_or_events, new_state}`
- new state is pushed to clients over channel
- Events dispatched on client

---

## `handle_message/3` to handle process messages
- Receives
  - message
  - state
- Return tuples same as `handle_event/3`
- Handy for `PubSub`!

---

# Sending the whole state every time?
- `json_patch` new in 0.5.1
- uses `json_diff` to calculate state patch
- sends a `lvs:update` event containing a json patch
- client applies patch to produce new state
- tracks a state version number to keep things in sync
  - although Phoenix Channels may make this redundant
- opt in

---

# Introducing `phx-live-state`
- javascript (typescript) npm
- increasing levels of abstraction:
  - `LiveState` - lower level API
  - `connectElement()` allows you to "wire up" a Custom Element
  - `@liveState` TS decorator lets you declaratively annotate a Custom Element class

---

# The goal:
## Your TS/JS should only have to:
- declaratively connect to LiveState
- render the current state
- dispatch events

---

## `@liveState` typescript decorator
- decorates a Custom Element class
- takes a single `object` param
  - url: websocket url 
  - topic: channel topic
  - properties - list of properties to set from state
  - attributes - list of attributes to set from state
  - events
    - send - Custom Events to send from this element
    - receive - Custom Events to receive and then dispatch on this element

---

# Lab 6: Say hello from another website

---

# Lab 7: Student registration

---