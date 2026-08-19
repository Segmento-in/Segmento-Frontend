## Problem Statement
The user wants to elevate the Contact page's aesthetic by integrating an interactive 3D element (the newly installed Originkit `hero-23` Globe and Stardust components), matching the high-end premium visual treatment applied to the footer. The existing static "Global Presence" map image is outdated and needs to be replaced. 

## Solution
Integrate the 3D Globe and Stardust from the `hero-23` Originkit component into the Contact page (`contact/page.tsx`). 
The 3D Globe will act as an interactive background element behind the main Contact form, bringing cinematic motion and spatial depth to the page. 
The static `Map_of_countries.png` in the "Global Presence" section will be removed to clean up the UI, and the focus will remain on the premium 3D element. Theme filtering (hue-rotate, saturate) will ensure the Globe matches Segmento's brand identity across light and dark modes.

## User Stories
1. As a visitor, I want to see a premium, interactive 3D globe behind the contact form, so that my first impression of the company is highly professional and modern.
2. As a visitor, I want the 3D globe to respond to my theme (light/dark mode), so that the brand colors remain consistent and visually pleasing without jarring contrast.
3. As a visitor, I want the 3D element to not obstruct my ability to type in the contact form, so that the page remains fully functional while looking beautiful.
4. As a visitor, I want to experience cinematic whitespace and clean layout when scrolling down the page, so that the information is easily digestible.

## Implementation Decisions
- The `Map_of_countries.png` and its containing bento tile in the "Global Presence" section will be deleted.
- The `MediaGlobe` and `MediaStardust` components from `components/originkit/ui/hero-23/media-globe` will be imported and used as absolute backgrounds within the top contact hero section.
- Z-index layering: The 3D container will be `z-0` (and `pointer-events-auto` if interactive, though we must ensure form fields are clickable). The form and bento tiles will be `relative z-10`.
- The 3D components will be wrapped in theme-responsive CSS filters to adapt the default Originkit globe colors to the Segmento brand cyan/blue in light mode.

## Testing Decisions
- Testing will be manual visual verification across viewport sizes (mobile, tablet, desktop).
- Verification of light and dark mode toggling to ensure the CSS filters trigger correctly and the Globe blends seamlessly.
- Verification that all form fields (`Full Name`, `Email`, etc.) remain fully interactive and are not blocked by the 3D canvas.

## Out of Scope
- Backend integration for the Contact form submission.
- Full replacement of the Contact page with the `Hero23` layout (we are only extracting the 3D assets to enhance the *existing* layout).
