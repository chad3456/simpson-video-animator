for (const who of Object.keys(FACES)) SHOTS['pt_' + who] = { layers: { p: { bg: '#3a2a36', draw(P) { portrait(P, who, { x: 800, y: 400, R: 150, f: 1 }); } } } };
