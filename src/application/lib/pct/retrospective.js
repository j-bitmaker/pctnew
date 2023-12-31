import f from '@/application/shared/functions.js'
import _ from 'underscore'

var underlyings = {spy : [['1927', '17.66', '0'], ['1928', '24.35', '0.378822197'], ['1929', '21.45', '-0.119096509'], ['1930', '15.34', '-0.284848485'], ['1931', '8.12', '-0.470664928'], ['1932', '6.92', '-0.147783251'], ['1933', '9.97', '0.440751445'], ['1934', '9.5', '-0.047141424'], ['1935', '13.43', '0.413684211'], ['1936', '17.18', '0.279225614'], ['1937', '10.55', '-0.385913853'], ['1938', '13.14', '0.24549763'], ['1939', '12.46', '-0.051750381'], ['1940', '10.58', '-0.150882825'], ['1941', '8.69', '-0.178638941'], ['1942', '9.77', '0.124280783'], ['1943', '11.67', '0.194472876'], ['1944', '13.28', '0.137960583'], ['1945', '17.36', '0.307228916'], ['1946', '15.3', '-0.118663594'], ['1947', '15.3', '0'], ['1948', '15.2', '-0.006535948'], ['1949', '16.79', '0.104605263'], ['1950', '20.43', '0.216795712'], ['1951', '23.77', '0.163485071'], ['1952', '26.57', '0.117795541'], ['1953', '24.81', '-0.06624012'], ['1954', '35.98', '0.450221685'], ['1955', '45.48', '0.264035575'], ['1956', '46.67', '0.026165347'], ['1957', '39.99', '-0.143132633'], ['1958', '55.21', '0.380595149'], ['1959', '59.89', '0.084767252'], ['1960', '58.11', '-0.029721155'], ['1961', '71.55', '0.231285493'], ['1962', '63.1', '-0.118099231'], ['1963', '75.02', '0.188906498'], ['1964', '84.75', '0.129698747'], ['1965', '92.43', '0.090619469'], ['1966', '80.33', '-0.130909878'], ['1967', '96.47', '0.2009212'], ['1968', '103.86', '0.076604126'], ['1969', '92.06', '-0.113614481'], ['1970', '92.15', '0.000977623'], ['1971', '102.09', '0.107867607'], ['1972', '118.05', '0.156332648'], ['1973', '97.55', '-0.173655231'], ['1974', '68.56', '-0.297180933'], ['1975', '90.19', '0.315490082'], ['1976', '107.46', '0.191484644'], ['1977', '95.1', '-0.115019542'], ['1978', '96.11', '0.0106204'], ['1979', '107.94', '0.123088128'], ['1980', '135.76', '0.257735779'], ['1981', '122.55', '-0.097304066'], ['1982', '140.64', '0.147613219'], ['1983', '164.93', '0.172710466'], ['1984', '167.24', '0.014005942'], ['1985', '211.28', '0.263334131'], ['1986', '242.17', '0.146204089'], ['1987', '247.08', '0.020275013'], ['1988', '277.72', '0.124008418'], ['1989', '353.4', '0.272504681'], ['1990', '330.22', '-0.065591398'], ['1991', '417.09', '0.263067046'], ['1992', '435.71', '0.044642643'], ['1993', '466.45', '0.070551514'], ['1994', '459.27', '-0.015392861'], ['1995', '615.93', '0.341106539'], ['1996', '740.74', '0.202636663'], ['1997', '970.43', '0.31008181'], ['1998', '1229.23', '0.266685902'], ['1999', '1469.25', '0.195260448'], ['2000', '1320.28', '-0.101391867'], ['2001', '1148.08', '-0.130426879'], ['2002', '879.82', '-0.233659675'], ['2003', '1111.92', '0.26380396'], ['2004', '1211.92', '0.089934528'], ['2005', '1248.29', '0.030010232'], ['2006', '1418.3', '0.136194314'], ['2007', '1468.36', '0.035295777'], ['2008', '903.25', '-0.384857937'], ['2009', '1115.1', '0.234541932'], ['2010', '1257.64', '0.127827101'], ['2011', '1257.61', '-2.38542E-05'], ['2012', '1426.19', '0.134047916'], ['2013', '1848.36', '0.296012453'], ['2014', '2058.9', '0.113906382'], ['2015', '2043.94', '-0.007266016'], ['2016', '2238.83', '0.095350157'], ['2017', '2673.61', '0.194199649'], ['2018', '2506.85', '-0.062372597'], ['2019', '3230.78', '0.288780741'], ['2020', '3756.07', '0.16258922'], ['2021', '4766.18', '0.268927363'], ['2022', '3839.5', '-0.194428242'], ['2023', '3933.99', '0.024609975']]}

var factors = {
    spy : 'S&P 500'
}

class Retrospective {
    
    factors = []
    factor = ''

    constructor(underlying = 'spy', core){

        this.core = core

        var d = underlyings[underlying] || underlyings['spy']

        this.factor = factors[underlying] || factors['spy']

        this.factors = _.map(d, (y) => {
            return {
                year : Number(y[0]),
                value : parseFloat(y[2]) * 100,
                name : this.factor
            }
        })

    }

    factorsLine(range){
        var d = []

        _.each(this.factors, (v, i) => {

            if(range){
                if(range[0] > v.year || v.year > range[1]) return
            }

            var prevvalue = d.length ? d[d.length - 1].total : 1

            d.push({
                value : v.value / 100,
                total : d.length ? prevvalue * (1 + v.value / 100) : 1,
                year : v.year
            })

        })

        return {
            name : this.factor,
            data : d
        }
    }

    prepareHistory(portfolios = {}, data = {}, range, ltrdata = {}, terms = {}, fee = () => {return 0}){
        var result = {}

        
        _.each(portfolios, (portfolio) => {

            var term = terms[portfolio.id] || 0

            if(term < 1) term = 1

            term = 1

            if(!data[portfolio.id]) return

            var total = portfolio.total()

            var hi = data[portfolio.id].scenarios

            var d = []

            var fhi = _.filter(hi, (v, i) => {

                v.year = this.factors[i].year

                if (range){
                    if(range[0] > this.factors[i].year || this.factors[i].year > range[1]) return
                }
                
                return true
            })

            for(var i = 0; i < fhi.length; i = i + term){

                var p = 0
                var pByPositions = {}

                for(var j = i; j < i + term; j++){
                    var v = fhi[j]

                    if(v){

                        _.each(v.contributors, (contributor) => {
                            pByPositions[contributor.ticker] || (pByPositions[contributor.ticker] = 0)

                            var pv = contributor.value / total
                            var ldata = ltrdata[contributor.ticker] || {}
                            var asset = portfolio.get(contributor.ticker)


                            var exp = (fee(contributor, portfolio) || 0) + (ldata.expRatio || 0)
                            var expweighed = 0

                            if (asset){
                                expweighed = exp * (asset.value / total)
                            }
    
                            pByPositions[contributor.ticker] += pv - expweighed
                            
                        })
                        
                        p += v.loss / total
                    }

                    
                }

                var value = _.reduce(pByPositions, (m, p) => {
                    return m + p
                }, 0)
    
                var prevvalue = d.length ? d[d.length - 1].total : 1

                var hp = {
                    value : value,
                    total : d.length ? prevvalue * (1 + value) : 1,

                    year : fhi[i].year
                }

                d.push(hp)
            }

            result[portfolio.id] = d
        })

        return result
    }

    getterms(portfolios){
        var result = {}
        return Promise.all(_.map(portfolios, (p) => {
            
            return this.core.pct.calcterm(p.positions).then((t) => {
                result[p.id] = t

                return Promise.resolve()
            })

        })).then(() => {

            return Promise.resolve(result)
        })
    }

    get(portfolios){

        return this.core.pct.customtestStressTestsScenariosFromFactors(portfolios, this.factors).then((data) => {

            return this.core.pct.ltrdetailsByAssets(portfolios).then((ltrdata) => {

                return this.getterms(portfolios).then((terms) => {

                    this.historyRaw = data
                    this.ltrdata = ltrdata
                    this.terms = terms

                    return Promise.resolve({
                        historyRaw : data,
                        ltrdata : ltrdata,
                        terms
                    })

                })

            })

        })
    }

}

export default Retrospective
