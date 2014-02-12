module.exports = function ResponseData(){

	this.load   = [];
	this.memory = [];
	this.disk   = {
		read  : { xvda1 : { disk_octets: [] } },
		write : { xvda1 : { disk_octets: [] } },
		disks : 1
	};
	this.network = {
		eth0 : {
			rx : [],
			tx : []
		}
	};
	this.cpu = {
		cores       : 1,
		utilization : []
	};
}