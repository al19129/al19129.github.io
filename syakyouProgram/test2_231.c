#include <stdio.h>
void swap(int*,int*);
int main(void){
	int x = 100;
	int y = 200;
	printf("x=%d,y=%d\n",x,y);
	swap(&x,&y);
	printf("x=%d,y=%d\n",x,y);
	return 0;
}
void swap(int* x,int* y){
	int w;
	w = *x;
	*x = *y;
	*y = w;
}