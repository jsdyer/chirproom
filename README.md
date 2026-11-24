# Chirp Room

Align the Hanford and Livingston gravitational-wave traces and listen to the final moment of GW150914. [Open Chirp Room](https://coolcode.ca/chirproom/).

<!-- coolcode:guide -->
Compare the unadjusted, published and custom alignments over two equal 170 ms windows. Apply the seven-millisecond shift and polarity reversal to see what changes near the merger and earlier in the recording. Press Play to hear the one-second stereo extract.
<!-- /coolcode:guide -->

## Data and interpretation

[GWOSC GW150914](https://gwosc.org/events/GW150914/) supplies 32 seconds of calibrated strain per detector at 4,096 Hz, beginning at GPS 1126259447. The [discovery account](https://www.ligo.caltech.edu/page/press-release-gw150914) describes the arrival difference. The collector whitens each detector with a Welch median PSD (two-second Hann segments, 50% overlap), applies a fourth-order zero-phase Butterworth band-pass at 35–350 Hz, scales by its own filtered noise standard deviation in seconds 4–12, and saves a central one-second crop. The displayed overlapping segment uses linear interpolation for fractional shifts. The score is the Pearson correlation from −150 to +20 ms around the display reference. It is sensitive to noise, filter and time window. Audio linearly resamples to the browser rate, preserves elapsed time and pitch, and uses common gain. The two original recordings and checksums are linked from the edition. The Gravitational Wave Open Science Center supplies the calibrated recordings as a service of the LIGO Scientific Collaboration, the Virgo Collaboration and KAGRA. Chirp Room filters, normalizes and crops those recordings for this display. [GW150914 version 3, GWTC-1 release DOI](https://doi.org/10.7935/82H3-HH23) · [CC BY 4.0 data licence](https://creativecommons.org/licenses/by/4.0/) · [R. Abbott et al., SoftwareX 13, 100658 (2021), on the first two observing runs](https://doi.org/10.1016/j.softx.2021.100658) · [GWOSC acknowledgements](https://gwosc.org/acknowledgement/).

## Reproducing the edition

Install NumPy and SciPy for signal processing. Run `python3 scripts/refresh.py` from the repository. The monthly GitHub Action checks the sources, validates the offline build and publishes changes. A failed retrieval leaves the previous release available. The retrieval date is separate from the observation period. Results are calculated locally in the browser from the bundled edition. Visitor selections are not uploaded.

Run `node --test tests/*.test.mjs`, `python3 -m unittest discover -s tests` and `python3 scripts/build.py`. Serve `dist/` to preview the standalone site. The Pages workflow also exercises the main interaction and responsive layout in Chromium.

<!-- schedule-reliability -->
## Schedule reliability

Public GitHub repositories can have scheduled workflows disabled after 60 days of inactivity. A separate weekly [schedule guard](.github/workflows/schedule-guard.yml) calls GitHub's enable-workflow API for an explicit list of refresh workflows and itself. It can restore workflows disabled for inactivity, preserves manually disabled workflows, and runs independently of collection failures.

This is an interim mitigation, not a scheduling guarantee: GitHub does not document active-workflow renewal as a permanent exemption, and scheduled runs can be delayed or dropped. A scheduler on our own Linux server is the planned independent trigger. The guard does not collect data, create dummy commits, or change source/check timestamps; successful collection and published data freshness still need monitoring.
<!-- /schedule-reliability -->
