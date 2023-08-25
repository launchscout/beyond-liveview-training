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
### My app isn't served by Elixir at all

---

# Cases where I want/need to integrate Javascript
- I want to leverage an existing JS solution
- Doing something client side is a better option

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
- As easy to use as adding a tag to a page
  - because you *are* just adding a tag to a pge

---

# The simplest example
```js
class SayBoopElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `Boop!`
  }
}
customElements.define('say-boop', SayBoopElement);
```
---

# Custom Element super-powers from the Shadow DOM
- Style encapsulation
- `<slot>`s to position inner content
- Shadow parts to provide style hooks

---

# Lit: commitment free help for your Custom Element
- Library *not* framework
- Gets smaller with each release
- manage attributes and properties
- trigger re-renders efficiently

---

# Lab 1: hello-world element
- Babbys first element
- Lets make a property
- Lets use an assign
- Lets add language switch
- Lets handle it

---

# But how to tell LiveView?

---

# What's a Custom Event?
- Just like any other event
- You get to name it whatever you want
- Has a `detail` property to contain a payload
```js
var myEvent = new CustomEvent('quack', detail: {species: 'Mallard'});
```

---

# Lab 2
- Lets make a change language CustomEvent

---

# If only LiveView knew about custom events...

---

# [`phoenix-custom-event-hook`](https://github.com/launchscout/phoenix-custom-event-hook)
- Gives you a hook to send Custom Events to LiveView
- Specify which events with `phx-send-events` attribute

---

# Lab 3
- Lets tell LiveView to change language
- Oops we forgot English
- Maybe we shouldn't hardcode languages
- Decomposing our element

---

# Hey wait a sec this is getting hard
- All those hook attributes yeesh
- Serializing our attributes blech

---

# An observation: functional component tags sure like custom elements..
## What if we could magically produce function components from custom elements?

---

# Introducing LiveElements
- Magically turn your custom element into a functional component
- Handles custom events
- Serializes attributes

---

# Lab 4: Lets make `<change-language>` a functional component!

---

# What makes a *good* Custom Element
- Data down, actions up
- Pass data in via attributes, properties (and possibly children)
- Communicate out via (Custom) Events

---

# A more interesting example: Map
## We want to...
- Render a map
- Display pins from a DB search within displayed area
- Search again when the user pans

---

# What if we could do it in LiveView
## What would we need?
- A map element
- Nested element for pins
- Events that fire when a user pans

---

# LitGoogleMaps to the rescue!
## [`<lit-google-map>`](https://github.com/launchscout/lit-google-map)
- displays a map (you may have guessed that)
- emits a `bounds_changed` event when the user pans
- emits a `tilesloaded` event when the map loads
## `<lit-google-map-marker>`
- nest these inside the map element to display pins

---

# [Airports on a map!](http://localhost:4000/airports)

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

# Using existing elements
- Choose wisely!
- How do you pass it data
  - Attributes and props are great
  - A url that it does an ajax call to, not as much
- Does it emit custom events?
  - Are they documented?
- What assumptions does it make?
  - more on this later :)

---

# Where do you find them?
- webcomponents.org
- component.gallery
- so many design systems..
  - Microsoft
  - SAP
  - Adobe
  - IBM
  - Github

---

# Next example: sorting and pagination
- Not super easy in LiveView
- Certainly not generated OOB
- Could we have an easier time with Custom Elements

---

# [Carbon `<bx-data-table>`](https://web-components-v1.carbondesignsystem.com/?path=/docs/introduction-welcome--page)
- Works great for sorting at pagination
- Emits reasonablish events
- Broken (for our purposes) in next version :(

---

# What do we wanna do
- Replace generated live view scaffolding
- Sorting
- Pagination

---

# Let's see sorting

---

Lab 5: Pagination
- we'll use [`<bx-pagination>`](https://web-components-v1.carbondesignsystem.com/?path=/story/components-pagination--default)
- Add custom_element to view
- Add `<.bx_pagination>` to template
- Add handle_event to view

---
