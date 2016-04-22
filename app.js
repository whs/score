!(function(){

var fetch_list = function(){
	ScoreApp.fetch_list(function(o){
		var target = $("#files").empty();
		$.each(o, function(k, v){
			var label = $('<label></label>').text(" "+v.name);
			$('<input>').attr({
				type: "radio",
				name: "file",
				value: v.id,
				disabled: v.uploaded != 4,
				required: true
			}).prependTo(label);
			label.appendTo(target);
		});
		target.find("input:first").attr("checked", true);
	});
};

var nyancat = 'data:image/gif;base64,R0lGODlhagAqAOMNAL3/9///AP/MmTP/AP+Z//+Zmf+ZAJmZmQCZ//8zmWYz//8AAAAAAP///////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBwAPACwAAAAAaAAoAAAE/vC9Rau9S+rNJf5Vx4xkaZ7o2a0aCLKs+4lpbatwJ+98j42CoHBILBqLo9zGx2x+gMeoFMlQtpxYH3RI6Hq/4DCYas2ad1uheM3ukpWGuHxONzTreDkl3e4mEl9/bUNJcHl4d4d1ewxcfYJekGuEVYaKl5iZcVCBgH2fX0GFOZqlpnSckZ6goKKVpKexmqmsXyWdoQKFJR2yvpe0tV23qrm7JB0BysvMzQGmztHLm40CwsMMB9oHI5O6JNvcrw/S0tDlztRB1wQj4d1iru7bo+To9/jMKfrVn5Lt2cKJC+NKoLgN+RLe27cs2Jp/894xIPjNYD2FGKNFFDdCmUNQ/hslnjCo7WLGkx4DliSRct21kPRQkDyoYYDNmzhzDsCos4RIEi5xsYE5syhNCTqT3uSZ02fMEkGLDVVptGo9pVizarXpdOXHhwmIVjVaaKvZswO6cuwH6o/YsTPLop2bVW2qf2tgAgDw9sDejXLpCm4KLqZLvGL08qVq8C/VQggiS55MGcHcypVTRP0EU+1Kr48rYR5tGS1pyZqt1epcWCJoiRJOy55NOzJU1WBtBSzAuwBcgb0LQK5NvLhtoLjFQNzd+3e44MONS6fNhwBi3dqCf47p+gB00dPDn65+3cs87eK6b/8uQYH79/DjKyguv/7740VYsb4ReoN9+/T9dicffkTox9haNsCmgYAMNuigeydMEUVfZI3T3oMYZgihCRIeQWFR9Vyo4Yj/7cffiSiyQOKK9ZmI4os1WGFFhjI+ABgJGyrIwo0S8FijEjTKeOMIOcaUg48+/qjkkjTg0KMJNTppIzJMVmllChtIeSSUGvACQwQAIfkECQcADwAsAAAAAGoAKAAABP5wyUnrejjr/ayfHMaMZGme6Bmu3eexofuGaW2jMCfvfP+NgqBwSCwai6NcxsdsuoDHqBTJUGKcWCd0SOh6v+AwmKrMmntboXjN7pJzhrh8Tjc063g5Jd3uJhJff21DSXB5eHeHdXsMXH2CXpBrhFWGipeYmXNQgYB9n19BhTCapaZ4nJGeoKCilaSnsaaprGElfqsErholGrK/mbS1X7cEkroCow+9GQHOz9DRAabS1c+bjQLDxAwH3gcjYbvL3d+F1tbU6NLYQdteI9/gDOLJlfHmlev7/P3SwmuOdcEnL5wXVwTzYfDHsGE1gGIEEkjozaAbexTnLXTI8R8Jj/7u3k0sJ68iipIKH3Rc+awESG0iM5o8gdIkhgE4c+rcOaAhT5wJR0CDKNEWyZpIURb6ybQnQ6ZBGQzNFqYoGJlJkS5tyrVr06gnQn6ChDVr1hFe06odANaE2EeeyprVymCt3a5YU1k1ihIAALl+o94d/DMvVWO52mQMfLTv36MjEEieTLkyAruWLZcoeHhYxs0l8YE2mbn05bWmJ4+e95bVZxJKy62OnLq27dsIwsIMmHiktwLAC8xFGbwAbdzIk+d2uztib3zFh5csfly5ddx8EH+CHtwk5+8HqDO4Tv529r3wykWfB957+OAjFMifT7++guT288+nnKZ1n9c3QH1WiX764Uegffxl44hrjc0TIGcYHCjhhBTaV8IUU8h11isPVOjhh/ldiGEUGialDIgoethWgCy2yGGEKcZ44Iou1piCFSx8iCOMUckXlRI/kgPhjivouKOPAiI5JAxBBknkk1BuoIKUJuA4pQhVRqkllFdm0CWTWWLJDAcRAAAh+QQJBwAPACwAAAAAagAqAAAE/vDJSetcOOu9rL9ciH1kaZ6fKKKgurEw6s50LTJ4ru98z8cSm3Co8hmPPeCDyCTiBNCodEqtUnGxprb2tHq/V0ZWaCibz2jDsNyVEt7wuHwuD7PW6XwZ347S/4Bvdih6hYaHiH2BbwkJcY2BUliEiJWWhoqLkHCbf5JilJeio12PjouocVCTJ6Oul6Wcp6mpq6CtlwG6u7y9AaK6sbRzOoyzBLYUOhbAvs66zcLDccUEncgCrA/LFc/e3+Dh0tM4B+YHOHPJ2wzn6LcP4fLz4OPD5efpddmg+Oba9AIKDMYACqprb/zlY6CKn8J/8AZKlGdvDkICD9811OEOIoWA/gNCihxJcgDIARVTZYTIo+PCj/RKyhR5MiWqle9aunxHYabPn0CD2rtIrN3Oo0e1BV3KFOjQY39wIt2ptKlVqzoMptokdSrSSVfDLs0qgBZXo17TvnxgFYHbt3DjIvh5RCtROhkBAOiqVyHYpnIDv6VrxC5UQHn3ot3Zd/EkwZAjS+ZItWDZaRgXs9T8brO7x5JDi0ZA2aVNxJxLL/S8drRryBl5aP1zEV+B2wXUdsRdAPTr329j75hNp7ZR3rrd8fYtWoHz59CjKxDsw3mmu9SO44b42bH228xDSx//nHoP65YN3/yeu/Pq98tBkZ9Pv779PsTXm0biF579/wDWboffZbQIx193FASo4ILoDQjGFF1NpY0EDFb4H1kPWhHhV/BQGGAMCkqAD38klrjDByHCkOKIJrbInxIwxsgOgjOuVUJ/Inon444w4FijRyb46COPRJLwQwVHnpAkO9wU6SSSJ0LZZJBR5jilBBEAACH5BAkHAA8ALAAAAABqACoAAAT+8MlJ61s4672sn1yYfWRpnp8ooqDKsTDqznTtMniu73zPx7agcOYrGnvAoVKJEzif0Kh0KsWxlthgk8rtVhnXoGFMLpsNwvIWSmi73/A4/HtKn+9j+3j9lPv/bXQmeISFhod7DGyABAkJb46AUFaDiJaXhHyMjY9ukX+TYJWYpKRbkJ2bqgROlCWlsJennqmrjK2ir5cBvL2+vwGYvrO2cDptn4ECrg86FMLA0bzQvMTFbsecb7gUzhPS4OHi49WKAtfYDAfrBzhx3M3q7JTk9fbh1sU47O0M78ui9s0Tda+gwQD55CRLx2+dOze4BPKjd7DiuIRxFraROHAbQI7+DgnaG0CypMmTA+6ZxKgK5EAeDQdKUImyJkmaJFluchkSZsx+EmwKHUq0aE5zGWv54fmzacigRqNKFZpQoxymTn9SmspVKg8nqz5hzeoUR9ezRL+eUyVWHtm3A6cimEu3rl0ERXVMRKqtpVt2AACMDczRrNS7iOnmzbEXbN+df9cRjtxw8t7EmDNrrstU5x+XehsKDB1ys+nTdDvz1UeZ9MCef3Ggno25cA/HfqwKLMC7ANyGvQvIpk2cc+zba3MrJbC7929+wYefVkC9uvXrChLbtq7p8Wd5wUPuHX8gOoPZ2NNX136cuznHVuM05y3+tX3z6vPr3+8eB3Y+uPl4FdMRjMn0AH8IJlidDv+914ctoBF4nAQKVmhhfw56McVYWTFz4YcK6qBhFxyWlcuBCsZQoQS2SejiixasCIOMLb5ooxEx5KhjBbaxOKEJPcaz145E7hhkkCUc+WORTKLwA487sPCkj940aSUJU06QZZJRatmlBREAACH5BAkHAA8ALAAAAABoACoAAAT+8L1Fq71L6s0l/lUnjmRpciB4bum3vvDbznQNMniu73zPx7agMOUrGnvAoVKIEzif0Kh0KsXJllhak8rtVhkvg3hMLhuE5vSYsoUS3vC4fC7/ntRqNN7MZkjpgIFvdiZ7hoeIZG0Cgm8JCXGPglBWhYmXmIp+T40EknCfgJRglpmmiFuRkJ2sgwKVJaeyhqmgq62dTrAkAb2+v8ABmMHEvmK1uHA6qnG6pDodxcXD0sHHm8lxy7bNr8850dXi4+S+yLg4B+oHOKLe6eu75fP0wOet8OrtdM757KQS6gmcd49OKAL+9DGY42xdPIAPBkoUV3DOwYT/GHpzqHDDgI/+IEOKHEBvpI+PvSo2wqiQB8eHHkfKRDnPZA+aKgWx/Ofy5b+YM4MKlYnRhxOLt+js9Mn0p4ahUKMW7XFUzsE5S5u+3BW1a1AdTHVU7fQoq9awpLyqFQnWp1hGrMoyOEuXYyUEePPq3YtALV+8PhRWvap0LkcAALIi9nf3r2O/fwP/G5wUEMbFhplidtjYsefPoPnyGMtq6tSWmZ2GXs068g7SnUynVoiaM6nWuHMDxhboouECwAvU5Ri8QGfdyD/n9JQUXvHhDotXUkC9uvXrCnBj3159txvmOn8Hp/3QtjrppLhz164eu3dO4AM5H//PfPkD6CW038+/P/W338VzNhtPR9i2gX8IJlgdgPAJuNURjEGk4IT7GeUFFWY1tYt+FHaInYUXfgGdXRDFwKF/J8gG4Yoslmjiif2lOGCLNK744o0wRCiBjibwyCOOQK7gY2obijCkgUEmWcIPHDApIzQaOKnklBtIueMOL0hpJQcRAAAh+QQJBwAPACwAAAAAaAAqAAAE/nDJSet6OOv9rJ9cKI5kuX2fqaGe6r4uK880y9x4ru/8HtfAoK1HLPpUwqTyJmg6n9CoNHozKa9A5nTLpTJMhrB4TDYEy2gxRfskuN/wuDzuJaXT53t5zYjO/4BudSN6hYaHZWwCgW4JCXCOgU9VhIiWl4l9TowEkW+ef5NflZilllqQj5wEOZIClDkaprOHqJ+qnK2ATbA4GgHAwcLDAZfEx8FjtqtvNwfPBzeNuAS8ONDRo8jIxtvEyprMcM7Q0p3U1uTPlN7t7u/Ey+Lq5Qxy1tjr2vD8/fHh4tzQ03fvFYN82TD4W3gsx78mnECxOogw246KCR8w3BjM4TB5/n8kDqx3sSKlAShTqlw5oB9LlPRuCAO5aiTGmxlf6mzJT2dMBjMBBrSJ0+SonUiTIv25A2IcieMoFp1aT6nVqwOY6nCa6g9Rqkaxik1KlGbIBCMBAPh6QO3PsXBflhXKyFHatVIrus17A4Hfv4ADIxArWHAObLagzhl5OB+5xvoKSx6MdfJfyNmcKpbD+Jpjipj7Wh5NujSCpovmUSzAugBYbK0LiDZNu/bpramZkYv9Glrs2baDmzZ7K+oz3tkQ813dGrjw55OJTzN+APlP5cebM1DAvbv37wpqgx/fHbCi6Yw6G1mOgTx58e7Bm9ekmZrXvPrWK28fv7///93ldOCHar3tlwGACCb4nYBQDIXfa5Twp+CE/T2GQxddrNcDBxR26J6FimDohYY6wMAhgi6oR+KKjUVo4okApvggizR65uKLOL7wEwY7ltBjjzkGqcKP7PlYJJBCJinCETyWOKSTGjCp5JRRQvmAlCRgeaWVHEQAACH5BAkHAA8ALAAAAABoACgAAAT+8MlJ61w4672svxsjjmRpnuanrhXnZmwbonSdxuCr73wvCsCgcEgsEkW4R2/JXP6M0OiRkWxar5inkMDter/g7zSGLTsZxLB6zR2zrIa4fE43wA1aAZubSHj7bEJIb011hnJ3eXsEgF2NaoJULIeUlZaXT39+i5xtAoMrl6KjlpmOm52LQKAqpK6vcaapXSSaXquSJBawvKKyswS1p7efuSO7pAHKy8zNAa7Kv50iB9UHIpDF1Nas0M7fyt7SnNvV2GG45deSEuDu7/AozONgj8EM1twMYLj55uwP4AkcGO3EPDR69thT949fMX/rKBCc6E4diYJAgN2D+M8Ex4j+EyiKbGZxBMaEsxjq88iRFcUBMGPKnDnAGYl8JjJ+sQdG5cefINtNpEk0ps0ROEvotLXGJ9CWAItKnUoV5s2VCDv1cfr056CqYMMOuNoxK6et+Lqq/SdBrFuqZNfp5BlGJQAAXA/cLdn2rV+acU3R7Zk2397CHA8n7RsWgePHkCMjqIpiKTnEZSFuCyzJreTPjymfsLxIZdx/mfVJAM26tevWJEjvRLXxQIHbBdbmw11g0OvfwFnHRhlmYVreuq3x9h28uXMEihjRJlwN+bqk2G3jZv68u+vog2kdx41aX/blkporWM++vXsF6hXkka3GtA2+E+K/3w8/+Pr5xLFrYd99i03A34EIJohgTlIYkRdQrEig4IQUHshgg1MkVyAFFXZY4YD3hSjiBx6WmCCIIqZIA4kVJiHhhCUNgt8H+M3oQYcuPkBhjMZs6EGNiEWY45BEokDBDTEg+YAuRDbppJETKLmCkkx+EAEAIfkECQcADwAsAAAAAGoAKAAABP7wyUnrWzjrvayfHMaMZGme6PmtbBW+XUu9aW2j8gzvfM+PgqBwSCwai6Pcxcds/hjHqNSYzDmv2AWQSOh6v+AwGMmQZc++7VDMbnfJ5qZhTq/bDc66WuDuJhJff25DVSx5d4hzh3N7fQSCXpBshGUtiZeYmZqMUHyRgI6hbwKFK5unqJhbgaCijkGlH6mztAarrmElfq0EsJUSJRS1w5u3uF+6j7y+FMETqQHR0tPUAdDSxscjB9wHI2HMD9vdVdfV59ao09m449zfY6SV7t6V6Pf4+frR7GKSXvTeMfjiK2A9CfsSKsTXL8y/LgbhjSrRjZy9hRjRlajWMJRBgf4nKlaskrEktY0nOx0DyECkxZAuDz5YOKCmzZs4B2hsafFmv4diPsYcKhChwpxIbe4cycCnSjBAc/EkStWihKRYs2qtSS9FEFGQhFYlOmKr2bMDuqL4Girs1LFwy6Kdm1XorahB33IDAEDsAb5q6QpGavcpXqkuAesVqZjpXASQI0uejGArRYts2y2+zBTkW7lnKYuObJkE08yuIpoWOY5zvdGwY8uOfQK1Q14QeRbYXQCuSN4FRsweThx2bU9sgI4D7rsicOHFo0uP3EiZo+W8BXa2yO05g+ngi1c/zLJ79nrbtR/wHl2B+/fw4yto/36P7T6qb3yuRF++//nFwXNnH3IebabffhL8p+CCDDboXglTTOEXVaU4aOGFC0IYYRQTkvXLAxiGGKJaB5ZoogUipuggiSa2aAOKFyqRYIziIFgjUzKoBYyNMFooI4g06nijVS0IKeSPSCZZgQpLmqAEkzs6o+SUSEI5gZUsWInlBBEAACH5BAkHAA8ALAAAAABqACoAAAT+8L1Fq71L6s0l/lUnjmRpiiB4bum3vnDcznQNMniu73zPxx6bcHjzGY8/IHFJxAme0Kh0Sp3iZMwszVnteq2MmGFMLpsNw7OaTOFGCfC4fE6fg1/rdTp/bjOmdYGCcHcrfIeIiWVuAoNwCQlykINRV4aKmJmLf1COBJNxoIGVYZeap4lckpGerYQClieos4eqoayunk+xJgG+v8DBAZnCxb9jtrlzOo+4BLulEjodxsbE1cLInMp0zJ/O0BvTHNjl5ufAydw4B+0HOHThD+zuvOj3+MHqyvTt8HawSvV7F+1BvoP39tURFWegPwZyoDkkuAGhxXIK6TCEM/HfKx3+7uoVHECypMmTA/ChXFnSV8ZWEx/yCBmSF0uWKm+idLmNG0cGNEXODEpRg86jSJOaVLixTkyiUB9uUEq16kmmzgI9jUrUptWvSHU8cQVqK9eolsCqvSm2UauyQM/KrVkKgd27ePMiqKoX75Gx31xNBADALOGBlvoq3kt1MYK/bptqjRvyMGWilulKcMy5c16QXXvyuyyTNMHSmh94Xs0ZdNCXgzrmeB3XdVHWuPvKbjuoKb0CwAvMpRm8QOLcyO3uzgE4kO+4xYeHLG5JgfXr2LMrwK3dug/lnABLXgY9+EO66A9QL9W9/XbW7b8/Dh85q9PywM+LTL9egvv/AAZ+GB99zcFkGhKzibSBgAw2OCAguSx3RGr+OWihg2190YVZXPFS4YUgApihhlRwiFZBQDzgYAze1YbgizCOk+KCDbKoAD0x5vjijDzOiJhAl3kowo/SBIlij0iWQOQ8Rp6w5JJJRklCEuLs8AKVTMoo5ZZValmkl1NaqQGWEkQAACH5BAkHAA8ALAAAAABqACoAAAT+cMlJ63o46/2sn1wojmQZfp+poZ7qvjArzzTL3Hiu7/we18CgrUcs+l7CpPImaDqf0Kg0enMpr0DmdMulMlyGsHhMNgTLaDFF+yS43/C4PO41pdPne3nNiM7/gG51JXqFhodlbAKBbgkJcI6BT1WEiJaXiX1OjASRb55/k1+VmKWWWpCPnKuCApQkprGHqJ+qrJxNryMBvL2+vwGXwMO9Y7S3cTmNtgS5oxg5GsTEwtPAxprIcsqdzM4a0RnW4+TlwMfaNwfrBzdy3w/q7JTm9fbD6Mjy6+50rqP72o26R/Bevjmg3gTkxwCOs4UCMRScWO6gnIRuIPZrlYPdvFH+A0KKHElygL2SKEX6srgKIsMdHj1SSpnyJM2SK7Npy8gg5keYPiM+uEm0qNGSBzHOcRm0KUMMR6NKRZmU2R+mToPOnMq16I4mrDxhzer0RtezNL8uWiW2J9m3MhkgmEu3rl0EUu/e7fgRbDdWEAEAGCs44A29iPFGTUyXL0O/Sq+69Vh4ctDKcRlr3pyYKctAGnH4lOdYIOfTqD3r1Gf5ZWuBrjOjno3YMA+/f5TKK8C7ANyYvQscpk28rm21gXS7Df7bY/AbCqJLn05dwezq0W0b1wTZ6tLlvRnGHX/gOQPs6K2jRq+9Mfe1kZOB5y3+I3nz6fPr35+juiLcLb14ZoRoH2Gw34EIStcfdf+tBZiAA1pGSYIUVjhdDl10MVZWuljoYYIYZrjFhmU9A8MDFMKQnYQRtuiiiSeimKCKChz34o09xKijjrZBw6IJPcbz445EwhBkkCQcOWSRTJZwBDg6uPCkkOE0aWUIU/pYpZNRZpBlBhEAACH5BAkHAA8ALAAAAABoACoAAAT+8MlJ61w4672sv1yIfWRpnpYooqC6sbDpznQtMniu73zPx7agUOUrGnvAoVKIEzif0Kh0KsWxlthak8rtVhnXoGFMLpsNwvEWSmi73/A4/HtKn+9j+/op7/vbdCZ4g4SFhnt/bQkJb4t/UFaChpOUhIiJjm6ZfZBgkpWgoVuNjImmb06RJaGslaOapaenqZ6rlQG4ubq7AaC4r7JvOqSoApE6Fr68y7jKwMFtw7DFxzkWzNjZ2tvPsjgH4Ac4nMY54eK1D9vr7Nrdp9/h43K08eCq6u36+wHvcZsE7MljEIfWuXvp+Clc5w8OQIEIC5Y7iI6CvgEYM2rcOICXD1z+GBv+gTiQB0WEFttxXJnRYw+QA0T6IYnQ5El8LHPqzEnSh5N/seTQPEkU5YSdSJP27PHTYdA4Q4veTJe0Kk9zU2WSiiq1aCSrYDfqIKqjqalFXLtOlQAWgdu3cOMiYOkDYVOAfUgCAMB1r8CvVuUKfku3h10Bip4KZUDRL+Oijs9FGky5suXBPMzCeywZa+eanCs+uEy6tODMiIMtXQq6swTTsGO7lfnwcYHbBdRSxF1gsuzfl2kHjcdb90HevksrWM68uXMFsJdfwguHOG6EnweCQ+4p+vPvy71PVyzM9nV02bEf4C4BvPv38N+XjeItNGgjrifE38/f/Xw2m1FpdIRnorXX34H8+eQFFWl5lY6BCEboH1MLTtEgWQ8+cGAM8a024Icg4kPBhjB0aB86IaZ4RAwstvjAX57AeIKML4Ymoos4zmhjjDvqmB+NOQZpwg8VEKkjMhMYKeSSFigpgZMkKAklBREAACH5BAEHAA8ALAAAAABoACoAAAT+8MlJ61s4672sn1yYfWRpnpYooqDKsbDpznTtMniu73zPs7agcOYrGnvAoVKJEzif0Kh0KsWdlthgk8rtVhnXoGFMLpsNwvIWSmi73/A4/FtKn+9j+3j9lPv/bXQkeISFhod7DGyABAkJb46AUFaDiJaXhHyMjY9ukX+TYJWYpKRbkJ2bOpIClDoUpbGXp56pjKugraKvE5gBv8DBwgG+wLSbbzgHywc4bZ+BusrMlMXD18SXwcfIbdPLzpxvTjrMzaLY6err7L/c3d/UDHHkDObg6O36++nvyPH46Om6d04Cv4P9cgzzFwcaAYDyeBDEZxChxW0KhTGE4xAiPon+EynxG0CypMmTA7DFw2FyIyCPE2NSfDASpU2SKu3Ja6lIQLdkOmUKlSfhptGjSEmu7OGkoS2gQ6PeY5m0qtWlPJpyfOoGptSQDKyKrQrT5VaIAAB4PZB26di3Rsv27OYIrdqgE9vipWoVgd+/gAMjSFpOnlaHfiAWNjdt8bmxgiP/JZyD8Vxxt/B+1Hxus2XJoEOLDp3V589pBVIX+GpOdQEco2PLBl3650Odrlkzcw17tu/ff812xK0an+XjB3gzAM58tnBbqIt3lodcuW8F2LNr367genZNmF9yPlKZ6APv3NN3n60dPGI5isnvFaW+vv37+HVIsb1WKCUJ+AVqKOB9+kXBH2df/ffAgAw22FgOXnghHxIVNGhhgA/yEeEXE/JCAYMxCBhfhySWp6AFIMIg4ngltjhTDDDGOMFSEtBogo02yqgjDDjOd0KPlu0oJAo/zLgDC0VSkOSQTFqw5JIlQPmAlBREAAA7';
var load_data = function(i,u,p){
	ScoreApp.load_data(i,u,p, function(data, stats, pass){
		$("#loadscrim").hide();
		$("#login").find("input[type=text],input[type=password]").attr("disabled", false);
		$(".error").hide();
		var dialog = $("#result").clone().attr("id", null).removeClass("hide");
		dialog.find(".name").text(data['_name']);
		dialog.find(".filename").text(data['_fname']);
		var scoreTable = dialog.find("table:first tbody");
		var tweetText = [], shareData = {}, graphdata=[], graphsubjects=[];
		$.each(data, function(k,v){
			if(k.charAt(0) == "_"){
				return;
			}
			var row = $('<tr></tr>');
			if(v.rank){
				$('<td><a class="viewstat" href="#"></a></td>').appendTo(row).find('a').text(k);
				$('<td></td>').appendTo(row).text(v.score);
				var percent=$('<td class="percent"></td>');
				percent.appendTo(row).text(v.percent.toFixed(2));
				if(v.percent == 100){
					percent.css({
						"background": "url("+nyancat+") no-repeat #0f397c",
						"background-position": "-2px -2px"
					});
				}else{
					percent.css("background-color", ScoreApp.percentColor(v.percent));
				}
				$('<td></td>').appendTo(row).text(v.standard.toFixed(2));
				$('<td></td>').appendTo(row).text(v.rank);

				if(stats[k]){
					stats[k].histogram[v.score] = {
						y: stats[k].histogram[v.score],
						color: ScoreApp.percentColor(v.percent)
					};
				}

				var tweetSubj = k.match(/^([ก-ฮA-Z]+)/i)[1];
				if(tweetSubj){
					tweetText.push(tweetSubj+"-"+v.score);
				}
				shareData[k] = v.score;
				graphdata.push({name: k, color: ScoreApp.percentColor(v.percent), y: v.percent});
				graphsubjects.push(k.replace(/\([0-9]+\)$/, ''));
			}else{
				$('<td></td>').appendTo(row).text(k);
				$('<td colspan="4"></td>').appendTo(row).text(v.score);
			}
			row.appendTo(scoreTable);
		});
		if(u !== undefined){
			window.location.hash = i+"/u"+u+"_"+pass;
		}
		if(tweetText.length > 0){
			var link = window.location.protocol + "//" + window.location.hostname + window.location.pathname + window.location.hash;
			var piclink = "http://bd2.in.th/scoreshare/" + window.location.hash.substr(1) + ".png";
			dialog.find(".tweet").attr("href", 'https://twitter.com/intent/tweet?'+$.param({
				text: data['_fname']+" // "+tweetText.join(","),
				hashtags: "bd2score",
				url: piclink
			})).data("link", link);
			dialog.find(".fbshare").attr("href", 'https://www.facebook.com/dialog/feed?'+$.param({
				app_id: "168068966547348",
				link: piclink,
				name: "คะแนนสอบ "+data['_fname'],
				caption: link,
				redirect_uri: "http://bd2.in.th/scoreshare/close.html",
				display: "popup",
				picture: piclink,
				properties: JSON.stringify(shareData),
				actions: JSON.stringify([{
					name: 'ดูบนเว็บ',
					link: link
				}])
			})).data("link", link);
			dialog.find(".imgshare").attr("href", piclink);
		}else{
			dialog.find(".social").remove();
		}
		dialog.appendTo("body").dialog({
			width: 500,
			height: 600,
			title: data['_fname'],
			show: {
				effect: "clip",
				duration: 500
			}
		}).data("stats", stats);
		new Highcharts.Chart({
			chart: {
				renderTo: dialog.find(".graph").get(0),
				type: "column",
				height: 200,
				animation: {
					duration: 1000,
					easing: "swing"
				}
			},
			title: {"text": null},
			series: [{"data": graphdata, "name": "ร้อยละ"}],
			xAxis: {"categories": graphsubjects},
			yAxis: {"title": {text: null}, max:100, min: 0},
			legend: {enabled: false},
			credits:{enabled:false},
			exporting:{enabled:false}
		});
	}, function(err){
		$("#loadscrim").hide();
		$("#login").find("input[type=text],input[type=password]").attr("disabled", false);
		$(".error").text(err).slideDown();
	});
}

$(function(){
	fetch_list();
	$("#light").hide();
	$("#login").submit(function(){
		var file = $(this).find("input[name=file]:checked");
		load_data(file.val(), $(this).find("input[name=u]").val(), $(this).find("input[name=p]").val());
		return false;
	});
	$("input[type=submit],#sharewarning button").button();
	$("#sharewarning button[data-act=stop]").click(function(){
		$("#sharewarning").dialog("close");
		return false;
	});
	if(window.location.hash.length > 1){
		load_data(window.location.hash.substr(1));
	}
	$("body").delegate(".viewstat", "click", function(){
		var dialog = $(this).closest(".result");
		dialog.find(".active").removeClass("active");
		dialog.find(".graph").empty();
		var subj = $(this).addClass("active").text();
		var stat = dialog.data("stats")[subj];
		dialog.find(".subjinfo").text(subj);
		var tbody = dialog.find(".stats").hide().find("tbody").empty();
		var scoreTr = $('<tr></tr>').appendTo(tbody);
		$('<td></td>').text('คะแนน').appendTo(scoreTr);
		$('<td></td>').text(stat.hiscore).appendTo(scoreTr);
		$('<td></td>').text(stat.lowscore).appendTo(scoreTr);
		$('<td></td>').text(stat.lowscore2).appendTo(scoreTr);
		$('<td></td>').text(stat.mode).appendTo(scoreTr);
		$('<td rowspan="2"></td>').text(stat.average.toFixed(4)).appendTo(scoreTr);
		$('<td rowspan="2"></td>').text(stat.sd.toFixed(4)).appendTo(scoreTr);
		$('<td rowspan="2"></td>').text(stat.count).appendTo(scoreTr);
		var personTr = $('<tr></tr>').appendTo(tbody);
		$('<td></td>').text('จำนวน (คน)').appendTo(personTr);
		$('<td></td>').text(stat.hiscore_cnt).appendTo(personTr);
		$('<td></td>').text(stat.lowscore_cnt).appendTo(personTr);
		$('<td></td>').text(stat.lowscore2_cnt).appendTo(personTr);
		$('<td></td>').text(stat.mode_cnt).appendTo(personTr);

		new Highcharts.Chart({
			chart: {
				renderTo: dialog.find(".graph").get(0),
				type: "column",
				height: 200
			},
			title: {"text": "Histogram"},
			series: [{"data": stat.histogram, "name": "จำนวน"}],
			yAxis: {"title": {text: null}},
			legend: {enabled: false},
			plotOptions: {
				column: {
					shadow: false,
					pointPadding: 0,
					groupPadding: 0,
					borderWidth:.5,
					borderColor:'#666',
					color: 'rgba(204,204,204,.85)'
				}
			},
			credits:{enabled:false},
			exporting:{enabled:false}
		});

		dialog.find(".stats").show();
		return false;
	});
	$("body").delegate(".tweet, .fbshare", "click", function(){
		var displayWarn=true, self=$(this);
		if(window.hasOwnProperty("localStorage")){
			if(localStorage.displayWarn){
				displayWarn = false;
			}else{
				localStorage.displayWarn = true;
			}
		}
		if(displayWarn){
			$("#sharelink").attr("href", $(this).data("link")).text($(this).data("link"));
			$("#sharewarning button[data-act=confirm]").one("click", function(){
				window.open(self.attr("href"), "tweet", "width=550,height=420,toolbars=no");
				$("#sharewarning").dialog("close");
				return false;
			});
			$("#sharewarning").dialog({modal:true, width: 500, title: "คำเตือน"});
		}else{
			window.open(self.attr("href"), "tweet", "width=550,height=420,toolbars=no");
		}
		return false;
	});
});

})();