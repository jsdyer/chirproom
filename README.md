# Chirp Room

Align the Hanford and Livingston gravitational-wave traces and listen to the final moment of GW150914. [Open Chirp Room](https://coolcode.ca/chirproom/).

<!-- coolcode:guide -->
Use Apply published alignment to move Livingston seven milliseconds later and reverse its polarity. Compare the waveform correlation around merger, then play the one-second stereo extract. Audio starts only when you press Play.
<!-- /coolcode:guide -->

## Data and interpretation

[GWOSC GW150914](https://gwosc.org/events/GW150914/) supplies 32 seconds of calibrated strain per detector at 4,096 Hz, beginning at GPS 1126259447. The [discovery account](https://www.ligo.caltech.edu/page/press-release-gw150914) describes the arrival difference. The collector whitens each detector with a Welch median PSD (two-second Hann segments, 50% overlap), applies a fourth-order zero-phase Butterworth band-pass at 35–350 Hz, scales by its own filtered noise standard deviation in seconds 4–12, and saves a central one-second crop. The displayed overlapping segment uses linear interpolation for fractional shifts. The score is the Pearson correlation from −150 to +20 ms around the display reference. It is sensitive to noise, filter and time window. Audio linearly resamples to the browser rate, preserves elapsed time and pitch, and uses common gain. The two original recordings and checksums are linked from the edition. This research uses data obtained from the Gravitational Wave Open Science Center, a service of LIGO Laboratory, the LIGO Scientific Collaboration and the Virgo Collaboration.

## Reproducing the edition

Install NumPy and SciPy for signal processing. Run `python3 scripts/refresh.py` from the repository. The monthly GitHub Action checks the sources, validates the offline build and publishes changes. A failed retrieval leaves the previous release available. The retrieval date is separate from the observation period. Results are calculated locally in the browser from the bundled edition. Visitor selections are not uploaded.

Run `node --test tests/*.test.mjs`, `python3 -m unittest discover -s tests` and `python3 scripts/build.py`. Serve `dist/` to preview the standalone site. The Pages workflow also exercises the main interaction and responsive layout in Chromium.
