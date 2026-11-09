---
title: Content and shortcode example
description: Local illustrations, embedded content, and a sample video player.
weight: 1
tags:
  - examples
  - shortcodes
featured_image: /images/gallery/workspace.svg
---
This page demonstrates a few theme features using small, fictional fixtures. Images are self-authored and stored locally; no remote resource is fetched by these shortcodes during the Hugo build.

## A simple illustration

{{< demo-image src="/images/gallery/workspace.svg" alt="A stylized desk with a monitor and a plant" caption="A self-authored SVG workspace illustration." width="640" height="400" link="/images/gallery/workspace.svg" >}}

## Local gallery

The gallery reads the example site's static image directory.

{{< gallery dir="images/gallery" >}}

## Local embedded page

The iframe below loads a static page included with the site. Try its fullscreen button.

{{< iframe id="local-example" src="/embeds/example.html" >}}

## Video player

This Vimeo example only emits player markup during the build. Viewing it in a browser requires a connection to Vimeo; the rest of this page works without that video service. The sample video does not represent Alex Example's work.

{{< vimeo "76979871" >}}

## Content checklist

- Local images have descriptive alternative text.
- Sample content contains no real employment or contact details.
- The gallery and embedded page use no external image dependencies.

> Replace these fictional examples with your own content before publishing.
