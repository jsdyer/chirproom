"""Whiten against each measured record, band-pass, and crop away filter edges."""
import gzip
from hashlib import sha256
import numpy as np
from scipy import signal
from source import fetch, store

RATE = 4096
START = 1126259447
MERGER = 1126259462.4
BASE = 'https://gwosc.org/eventapi/json/GWTC-1-confident/GW150914/v3/'
DURATION = 32

def trace(detector):
    url = BASE+detector+'_GWOSC_4KHZ_R1-1126259447-32.txt.gz'
    compressed = fetch(url)
    lines = gzip.decompress(compressed).decode('ascii').splitlines()
    if '4096 samples per second' not in lines[1] or str(START) not in lines[2]:
        raise ValueError('Review sample rate and GPS start')
    raw = np.array([float(x) for x in lines if not x.startswith('#')])
    if len(raw) != RATE * DURATION or not np.isfinite(raw).all():
        raise ValueError('Incomplete calibrated strain')
    freq, density = signal.welch(raw, RATE, nperseg=RATE*2, noverlap=RATE, average='median')
    grid = np.fft.rfftfreq(len(raw), 1/RATE)
    white = np.fft.irfft(np.fft.rfft(raw - raw.mean())/np.sqrt(np.interp(grid,freq,density)))
    filt = signal.butter(4,[35,350],btype='bandpass',fs=RATE,output='sos')
    band = signal.sosfiltfilt(filt,white)
    # Scale once per detector, using an off-event part of the filtered record.
    band /= band[4*RATE:12*RATE].std()
    first = round((MERGER - START - 0.75)*RATE)
    segment = band[first:first+RATE]
    return dict(site=detector.split('-')[1],source=url,sha256=sha256(compressed).hexdigest(),
                trace=np.round(segment,4).tolist(),startOffset=(first/RATE)-(MERGER-START))

if __name__ == '__main__':
    traces = [trace(s) for s in ('H-H1','L-L1')]
    store(dict(coverage='GW150914 · September 14, 2015',count=2,rate=RATE,referenceGPS=MERGER,
               inputSeconds=DURATION,traces=traces))
