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

# Welcome!

---

## Goal: The best experience possible in these two scenarios:
### I want (or need) to integrate javascript with LiveView
### My app isn't served by Elixir

---

# Cases where I want/need to integrate Javascript

---

# What are the current options?
- Hooks
- JS Commands
- Both are pretty low-level and imperative

---

# We'd like to suggest a different approach
- Liveview is already good at HTML
- What if we could make HTML better
- HTML elements are a better"unit of abstraction"
- higher level and more declarative

---

# Web Components (AKA Custom Elements)
- Supported by all the browsers
- Framework independent components
- Use a library to help with no committment required

---

# What makes a *good* Custom Element
- Data down, actions up
- Pass data in via attributes and properties
- Communicate out via (Custom) Events

---

# The simplest example

---

# What's a Custom Event?

---

# Custom Element super-powers
- shadow DOM
- slots
- parts

---

# A more interesting example: Map
## We want to...
* Render a map
* Display pins from a DB search within displayed area
* Search again when the user pans

---

# How do we build it?
## You don't want to write your own
## Lots of 3rd party JS to choose from

---

# What if we could do it in LiveView
## What would we need?
* A map element
* Nested element for pins
* Events that fire when a user pans

---
# LitGoogleMaps to the rescue!
## `<lit-google-map>`
* displays a map (you may have guessed that)
* emits a `bounds_changed` event when the user pans
## `<lit-google-map-marker>`
* nest these inside the map element to display pins
---

# Halp! There's no phx-bounds_changed
## I know, we can submit a PR
## And then do it again for every custom element on the Internet
## Ok mebbe not..

---

# `phoenix-custom-events-hook`
Gives you a hook to send Custom Events to LiveView
```javascript
import PhoenixCustomEvent from 'phoenix-custom-event-hook';
let liveSocket = new LiveSocket("/live", Socket, { 
  hooks: { PhoenixCustomEvent }
  ...
});
```
---
# Airports on a map!
---
```html
<div class="map">
  <lit-google-map
    api-key="the_api_key"
    phx-hook="PhoenixCustomEvent"
    phx-custom-event-bounds_changed="bounds_changed"
    phx-custom-event-tilesloaded="bounds_changed">
    <%= for %{geo_location: %Geo.Point{coordinates: {lng, lat}}, name: name, ident: ident} <- @airports do %>
      <lit-google-map-marker slot="markers" latitude="<%= lat %>" longitude="<%= lng %>">
        <p><%= name %> (<%= ident %>)</p>
      </lit-google-map-marker>
    <% end %>
  </lit-google-map>
</div>
```
---
```elixir
defmodule LiveCustomEventsDemoWeb.PageLive do
  use LiveCustomEventsDemoWeb, :live_view
  alias LiveCustomEventsDemo.Airports

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, airports: [])}
  end

  @impl true
  def handle_event(
        "bounds_changed",
        %{"north" => north, "east" => east, "west" => west, "south" => south},
        socket
      ) do
    airports =
      Airports.list_airports_in_bounds(%{north: north, east: east, west: west, south: south})

    {:noreply, socket |> assign(airports: airports)}
  end
end
```
---

# So that's great at all but...
- Adding all those hook attributes is kinda tedious
- What about passing complex attributes?

---
# An observation: functional component tags sure like custom elements..
## What if we could magically produce function components from custom elements?
---

# Introducing LiveElements

---

# Lit: committment free help for your Custom Element
- Library *not* framework
- Gets smaller with each release
- manage attributes
- trigger re-renders efficiently

---
# We love LiveView

--

# Buy Y tho?

--

# We never have to write anything but Elixir!

---

Insert aggregiously non-Elixir LiveView example code

---

# Ok but why really...

---


## When is J
