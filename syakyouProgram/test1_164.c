#include <stdio.h>
int main(void){
	int array[5] = {1,2,3,4,5};
	int sum = 0;
	int i;
	for(i=0;i<5;i++){
		sum += array[i];
	}
	printf("sum=%d\n",sum);
	return 0;
}